module APIHelpers


  #Finds or create user by email
  def createUser(result)

    user = User.find_or_create_by(email: self.getParam(result.first.mail)) do |user|
      user.first_name = self.getParam(result.first.givenName)
      user.last_name  = self.getParam(result.first.sn)
      user.uid        = self.getParam(result.first.uidNumber)
      user.skip_password_validation = true
      user.roles << Role.find_by_name["employee"] #default role -> employee
    end
    user.ensure_authentication_token
    user.save

    success user: user

  end

  def getParam(data)
    data[0].chomp('"')
  end

  def getOption key
    AppSetting::where(key: key).first[:value]
  end

  def decrypt var
    ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base).decrypt_and_verify(var) unless (var) == ""
  end
  
  def ldap_login

      email = params[:email]
      password = params[:password]
      env = Rails.env

      ldap = Net::LDAP.new(:host => getOption("ldap_host"),
                           :port => getOption("ldap_port"),
                           :auth => {
                              :method => :simple,
                              :username => getOption("ldap_account"),
                              :password => decrypt(getOption("ldap_password"))
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
    model.create!(postParams)
    success
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
