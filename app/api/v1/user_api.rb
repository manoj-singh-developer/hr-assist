module V1
  class UserAPI < Grape::API
    version 'v1', using: :path
    format :json

    resource :users do

      get do
        User.all
      end

      params do
        requires :id , type: Integer , desc: "User id"
      end

      get ':id' do
        User.find_by_id(params[:id]) ? User.find_by_id(params[:id]) : {message: 'User not found'}
      end
    end

    params do
      requires :email, type: String
      requires :password, type: String
    end
    post "login" do
      email = params[:email]
      password = params[:password]
      ldap = Net::LDAP.new :host => LDAP_SETTINGS["development"]["host"],
                           :port => LDAP_SETTINGS["development"]["port"],
                           :auth => {
                              :method => :simple,
                              :username => LDAP_SETTINGS["development"]["admin_user"],
                              :password => LDAP_SETTINGS["development"]["admin_password"]
                           }

      result = ldap.bind_as(
        :base => "dc=test,dc=com",
        :filter => "(mail=#{email})",
        :password => password
      )

      user = User.where(email: email).first

      if result
        user.ensure_authentication_token
        user.save
        { status: 'ok', auth_token: user.auth_token}
      else
        { message: "Authentication FAILED." }
      end
    end
  end
end
