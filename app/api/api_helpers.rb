module APIHelpers
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
    user.save
    data = {:user_id => user.id, :role_id => user.roles.first.id , :token => user.auth_token}
    custom_token = JWT.encode(data, Rails.application.secrets.secret_key_base)

    success user: user, custom_token: custom_token
  end

  def get_option(key)
    AppSetting::where(key: key).first[:value]
  end

  def decrypt(var)
    ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base).decrypt_and_verify(var) unless (var) == ""
  end

  def ldap_login
    email = params[:email]
    password = params[:password]
    env = Rails.env
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

  def getCustomObject(special ,model , relations, exception , response_final = [], response = {})
    model.all.each do |user|
      special.each do |relation|
        response[relation] = []
        if relation == "languages"
          user.user_languages.each do |user_language|
            language = Language.find(user_language.language_id)
            response["languages"] << {
                language_id: language.id,
                long_name: language.long_name,
                level: user_language.level
            }
          end
        else
          user.user_technologies.each do |user_technology|
            technology = Technology.find(user_technology.technology_id)
            response["technologies"] << {
                technology_id: technology.id,
                name: technology.name,
                level: user_technology.level
            }
          end
        end
      end
      response_final << user.as_json(include: relations, except: exception).merge(response)
      response["languages"] = [] if response["languages"] && response["languages"].count == user.user_languages.count
      response["technologies"] = [] if response["technologies"] && response["technologies"].count == user.user_technologies.count
    end
    {items: response_final}

  end

  def getPaginatedItemsFor(model, relations = nil, exception = nil)
    special_relations = relations & ["languages","technologies"]
    if params[:page] && params[:per_page]
      items = model.all.includes(relations).page(params[:page]).per(params[:per_page])
      {
          :items => items.as_json(include: relations, except: exception),
          :paginate => url_paginate(items, params[:per_page])
      }
    else
      if special_relations
        getCustomObject(special_relations,model, relations, exception)
      else
        {items:  model.all.includes(relations).as_json(include: relations, except: exception)}
      end
    end
  end

  def paginateItems(items, relations = nil, exception = nil)
    return [] if items.nil?
    if params[:page] && params[:per_page]
      items = items.includes(relations).page(params[:page]).per(params[:per_page])
      {
          :items => items.as_json(include: relations, except: exception),
          :paginate => url_paginate(items, params[:per_page])
      }
    else
      { items:  model.all.includes(relations).as_json(include: relations, except: exception) }
    end
  end


  def authorizeAndCreate(model, postParams, &block)
    authorize! :create, model
    block.call if block_given?
    object = model.create!(postParams)
    return object
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
    return nil if !page

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
    return user
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

  def find_user(id)
    user = User.find(id)
  end

  def get_holiday(holiday)
    response = {
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
