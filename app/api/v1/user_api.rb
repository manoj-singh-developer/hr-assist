module V1
  class UserAPI < Grape::API
    version 'v1', using: :path
    format :json

    helpers do
      def nil_error field
        "This user didn't fill in #{field} field"
      end

      #Finds or create user by email
      def createUser(result)

        user = User.find_or_create_by(email: result.first.mail) do |user|
          user.first_name = result.first.givenName
          user.last_name  = result.first.sn
          user.uid        = result.first.uidNumber
        end
        
        user.skip_password_validation = true
        user.ensure_authentication_token

        if user.save!
          { status: 'ok', auth_token: user.auth_token}
        else
          { status: :error, response: "error_creating_user"}
        end
      end

    end

    resource :users do
      get do
        User.all
      end

      params do
        requires :id ,type: Integer , desc: "User id"
      end

      get ':id' do
        user = User.find_by_id(params[:id])
        user ? user : {message: 'User not found'}
      end

      get ':id/equipments' do
        user = User.find_by_id(params[:id])
        user.equipments.any? ? user.equipments : nil_error("equipments")
      end

      get ':id/languages' do
        user = User.find_by_id(params[:id])
        user.languages.any? ? user.languages : nil_error("languages")
      end

      get ':id/positions' do
        user = User.find_by_id(params[:id])
        user.positions.any? ? user.positions : nil_error("positions")
      end

      get ':id/educations' do
        user = User.find_by_id(params[:id])
        user.educations.any? ? user.educations : nil_error("educations")
      end

      get ':id/uploads' do
        user = User.find_by_id(params[:id])
        user.uploads.any? ? user.uploads : nil_error("uploads")
      end

      get ':id/schedules' do
        user = User.find_by_id(params[:id])
        user.schedule ? user.schedule : {message: 'Schedule not found'}
      end
    end

    params do
      requires :email, type: String
      requires :password, type: String
    end

    post "login" do
      email = params[:email]
      password = params[:password]
      env = Rails.env
      ldap = Net::LDAP.new :host => LDAP_SETTINGS[env]["host"],
                           :port => LDAP_SETTINGS[env]["port"],
                           :auth => {
                              :method => :simple,
                              :username => LDAP_SETTINGS[env]["admin_user"],
                              :password => LDAP_SETTINGS[env]["admin_password"]
                           }

      result = ldap.bind_as(
        :base => "dc=test,dc=com",
        :filter => "(mail=#{email})",
        :password => password
      )

      #user = User.find_by_email(email)

      if result
        createUser result
      else
        { message: "Authentication FAILED." }
      end
    end
  end
end

