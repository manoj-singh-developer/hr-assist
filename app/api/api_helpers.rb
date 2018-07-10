module APIHelpers

  def create_user_devise(user)
      new_user = User.new(email: params[:email], password: params[:password], reg_status: "pending") if User.where(reg_status: "pending").count < 20
      new_user[:encrypted_password] = encrypt(params[:password])
      new_user.save
      success(user: user)
  end

  def login_devise(user)
    error!('Incorrect Password', 401) if user[:encrypted_password].present? && decrypt(user[:encrypted_password]) != params[:password]
    if user[:reg_status] == "confirmed"
      user.roles << Role.find_by_name("employee") if user.roles.empty?
      user[:encrypted_password] = encrypt(params[:password]) if user[:encrypted_password].empty?
      user.ensure_authentication_token
      user.save
      data = {:user_id => user.id, :role_id => user.roles.first.id , :token => user.auth_token}
      custom_token = JWT.encode(data, Rails.application.secrets.secret_key_base)

      success(user: user, custom_token: custom_token)
    elsif user[:reg_status] == "pending"
      error!({ message: "Your account is not confirmed." })
    end
  end

  def login_method(user)
    email = params[:email].partition('@').last
    if ldap_login
      "Ldap login"
    elsif email == "assist.ro"
      "Non ldap login"
    elsif user.nil? && email != "assist.ro" && ldap_login == false
      "Devise create"
    elsif user && email != "assist.ro"
      "Devise login"
    else
      "Login error"
    end
  end

  #Finds or create user by email
  def create_user(ldap_info)
    user = User.find_or_create_by(email: ldap_info.mail.first) do |user|
      user.first_name = ldap_info.givenName.first if ldap_info.respond_to? :givenName
      user.last_name  = ldap_info.sn.first if ldap_info.respond_to? :sn
      user.uid        = ldap_info.uidNumber.first if ldap_info.respond_to? :uidNumber
      user.skip_password_validation = true
    end

    user.roles << Role.find_by_name("employee") if user.roles.empty?
    user.ensure_authentication_token
    user.reg_status = "confirmed"
    user[:encrypted_password] = encrypt(params[:password]) if user[:encrypted_password].empty?
    error!('Incorrect Password', 401) unless decrypt(user[:encrypted_password]) == params[:password]
    user.save
    data = {:user_id => user.id, :role_id => user.roles.first.id , :token => user.auth_token}
    custom_token = JWT.encode(data, Rails.application.secrets.secret_key_base)

    success(user: user, custom_token: custom_token)
  end

  def login_non_ldap_user(user, email)
     if user && decrypt(user[:encrypted_password]) != params[:password]
       error!('Incorrect Password', 401)
     end
     user ||= User.where(email: create_user_devise(email)[:user])
     user.roles << Role.find_by_name("employee") if user.roles.empty?
     user[:encrypted_password] = encrypt(params[:password]) if user[:encrypted_password].empty?
     user.ensure_authentication_token
     user.save

     data = {:user_id => user.id, :role_id => user.roles.first.id , :token => user.auth_token}
     custom_token = JWT.encode(data, Rails.application.secrets.secret_key_base)

    success(user: user, custom_token: custom_token)
  end

  def get_option(key)
    AppSetting::where(key: key).first[:value]
  end

  def decrypt(var)
    ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base).decrypt_and_verify(var) unless (var) == ""
  end

  def encrypt(var)
    crypt          = ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base)
    crypt.encrypt_and_sign(var)
  end

  def ldap_login
    return false
    email = params[:email]
    password = params[:password]
    ldap = Net::LDAP.new(:host => get_option("ldap_host"),
                         :port => get_option("ldap_port"),
                         :auth => {
                           :method => :simple,
                           :username => get_option("ldap_account"),
                           :password => decrypt(get_option("ldap_password"))
                         })
    ldap.bind_as(
      :base => get_option("ldap_basedn"),
      :filter => "(mail=#{email})",
      :password => password
    )
  end

  def get_custom_object(special, model, relations, exception, *params)
    response = {}
    response_final = []
    items = model.all.includes(relations).page(params[0]).per(params[1]) if params.any?
    model = items if items
    model.all.each do |m|
      special.each do |relation|
        response[relation] = []
        if relation == "languages"
          response["languages"] = m.get_languages
        elsif relation == "technologies"
          response["technologies"] = m.get_technologies
        end
      end
      response_final << m.as_json(include: relations, except: exception).merge(response)
      response["languages"] = [] if response["languages"] && response["languages"].count == m.send("#{model.name.downcase}_languages").count
      response["technologies"] = [] if response["technologies"] && response["technologies"].count == m.send("#{model.name.downcase}_technologies").count
    end

    if items
      {items: response_final,
       paginate: url_paginate(items, params[1])
      }
    end

    {items: response_final}

  end

  def get_paginated_items_for(model, relations = nil, exception = nil)
    special_relations = relations & ["languages","technologies"]
    if params[:page] && params[:per_page]
      if special_relations && model == User
        get_custom_object(special_relations,model,relations,exception,params[:page],params[:per_page])
      end
    else
      #TODO Refactor next condition
      if special_relations && (model == User || model.name == "User" || model == Candidate || model.name == "Candidate")
        get_custom_object(special_relations, model, relations, exception)
      else
        {items:  model.all.includes(relations).as_json(include: relations, except: exception)}
      end
    end
  end

  def paginate_items(items, relations = nil, exception = nil)
    return [] if items.nil?
    special_relations = relations & ["languages","technologies"]
    if params[:page] && params[:per_page]
      if special_relations && items.first.class == User
        get_custom_object(special_relations,items,relations,exception,params[:page],params[:per_page])
      end
    else
      if special_relations && (items.first.class == User || items.first.class == Candidate)
        get_custom_object(special_relations,items, relations, exception)
      else
        {items:  items.all.includes(relations).as_json(include: relations, except: exception)}
      end
    end
  end


  def authorize_and_create(model, post_params, &block)
    authorize!(:create, model)
    block.call if block_given?
    object = model.create!(post_params)
    object
  end

  def url_paginate(collection, per_page)
    @@per_page = per_page
    {
      :first => url_for(1),
      :previous => url_for(collection.prev_page),
      :self => url_for(collection.current_page),
      :next => url_for(collection.next_page),
      :last => url_for(collection.total_pages)
    }
  end

  def url_for(page)
    return nil unless page

    url = request.base_url + request.path + "/?page=#{page}"
    url += "&per_page=#{@@per_page}" if @@per_page
    url
  end

  def add_object_for_user(model, user_id, id)
    object = model.find(id)
    user = User.find(user_id)
    objects = model.to_s.downcase.pluralize

    return "Aready existing" if user.send(objects.to_sym).include?(object)
    user.send(objects.to_sym) << object
    user
  end

  def delete_object(model, relation, model_id, relation_ids)
    result            = model.find(model_id)
    relation_results  = relation.where(id: relation_ids)
    relation_name     = relation.to_s.underscore.downcase.pluralize.to_sym

    result.send(relation_name).delete(relation_results)
  end

  def project_with(objects, params)
    project = Project.find(params[:project_id])
    project.send(objects.to_sym)
  end

  def get_holiday(holiday)
    {
      holiday_id: holiday.id,
      days: holiday.days,
      start_date: holiday.start_date,
      end_date: holiday.end_date,
      signing_day: holiday.signing_day,
      employee_replacements:
        holiday.holiday_replacements.map do |holiday_replacement|
          partial_response = {
            project_name: holiday_replacement.project.name
          }
          partial_response.merge!({
                                    team_leader: holiday_replacement.team_leader.name
                                  }) if holiday_replacement.team_leader

          partial_response.merge!({
                                    replacer_id: holiday_replacement.replacer_id,
                                    replacer_name: holiday_replacement.replacer.name
                                  }) if holiday_replacement.replacer

          partial_response
        end
    }
  end

  def user_project_params
    ActionController::Parameters.new(params).permit(:start_date, :end_date)
  end

  def user_education_params
    ActionController::Parameters.new(params).permit(:name, :degree, :description, :start_date, :end_date)
  end

  def user_schedule_params
    ActionController::Parameters.new(params).permit(:name, :timetable)
  end
end
