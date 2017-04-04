module APIHelpers
  #Finds or create user by email
  def create_user(ldap_info)
    user = User.find_or_create_by(email: ldap_info.mail.first) do |user|
      user.first_name = ldap_info.givenName.first
      user.last_name  = ldap_info.sn.first
      user.uid        = ldap_info.uidNumber.first
      user.skip_password_validation = true
    end

    user.roles << Role.find_by_name("employee") if user.roles.empty?
    user.ensure_authentication_token
    user.save
    data = {:user_id => user.id, :role_id => user.roles.first.id , :token => user.auth_token}
    custom_token = JWT.encode(data, Rails.application.secrets.secret_key_base)

    success user: user, custom_token: custom_token
  end

  def get_option key
    AppSetting::where(key: key).first[:value]
  end

  def decrypt var
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
    result = ldap.bind_as(
      :base => "dc=test,dc=com",
      :filter => "(mail=#{email})",
      :password => password
    )
  end

  def getPaginatedItemsFor model, relations = nil
    items = model.all.includes(relations).page(params[:page]).per(params[:per_page])
    {
      :items => items.as_json(include: relations),
      :paginate => url_paginate(items, params[:per_page])
    }
  end

  def authorizeAndCreate(model, postParams, &block)
    authorize! :create, model
    block.call if block_given?
    object = model.create!(postParams)
    success
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
end
