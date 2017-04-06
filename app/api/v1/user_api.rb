module V1
  class UserAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do

      include Responses
      include APIHelpers
      include Authentication
      include AccessGranted::Rails::ControllerMethods

      def nil_error field
        "This user didn't fill in #{field} field"
      end

      def postParams
        ActionController::Parameters.new(params)
          .permit(:first_name, :middle_name, :last_name, :address, :birthday, :phone, :picture, :observations,
          :email_other, :urgent_contact, :car_plate, :assist_start_date, :courses_and_certifications, :courses_date,
          :schedule_id, :skills_level, :skills_type, :project_dates, :status, :email)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

      params :other do
        optional :with, values: ['positions', 'languages', 'devices', 'educations', 'departments', 'projects', 'technologies'], type: Array[String]
      end

    end

    resource :users do

      before { authenticate! }

      desc "Return all users"
      params do
        use :pagination # aliases: includes, use_scope
        use :other
      end
      get do
        getPaginatedItemsFor User, params[:with] , "auth_token"
      end

      desc "Returns a user"
      params do
        requires :id, type: Integer , desc: "User id"
      end
      get ':id' do
        authorize! :read, User.find(params[:id])
      end

      get ':id/devices' do
        user = User.find_by_id(params[:id])
        user.devices.any? ? user.devices : nil_error("devices")
      end

      post ':user_id/devices/:id' do
        create_object_for_user(Device, params)
      end

      get ':id/languages' do
        user = User.find_by_id(params[:id])
        user.languages.any? ? user.languages : nil_error("languages")
      end

      post ':user_id/languages/:id' do
        create_object_for_user(Language, params)
      end

      get ':id/positions' do
        user = User.find_by_id(params[:id])
        user.positions.any? ? user.positions : nil_error("positions")
      end

      get ':id/educations' do
        user = User.find_by_id(params[:id])
        user.educations.any? ? user.educations : nil_error("educations")
      end

      post ':user_id/educations/:id' do
        create_object_for_user(Education, params)
      end

      get ':id/uploads' do
        user = User.find_by_id(params[:id])
        user.uploads.any? ? user.uploads : nil_error("uploads")
      end

      get ':id/schedules' do
        user = User.find_by_id(params[:id])
        user.schedule ? user.schedule : {message: 'Schedule not found'}
      end

      post ':user_id/schedule/:id' do
        schedule = Schedule.find_by_id(params[:id])
        user = User.find_by_id(params[:user_id])
        user.schedule = schedule
        return schedule
      end

      get ':id/projects' do
        user = User.find_by_id(params[:id])
        user.projects.any? ? user.projects : nil_error("projects")
      end

      post ':user_id/projects/:id' do
        create_object_for_user(Project, params)
      end

      get ':id/technologies' do
        user = User.find_by_id(params[:id])
        user.technologies.any? ? user.technologies : nil_error("projects")
      end
      post ':user_id/technologies/:id' do
        create_object_for_user(Technology, params)
      end

      get ':id/holidays' do
        user = User.find_by_id(params[:id])
        user.holidays.any? ? user.holidays : nil_error("holidays")
      end
      post ':user_id/holidays/:id' do
        create_object_for_user(Holiday, params)
      end
    end

    desc "User login"

    params do
      requires :email, type: String
      requires :password, type: String
    end

    post "login" do
      result = ldap_login

      if result
        create_user(result.first)
      else
        error({ message: "Authentication FAILED." })
      end
    end

    desc "Return current user"
    get "me" do
      authenticate!
      current_user
    end

    desc "Update profile user"
      params do
        optional :first_name, type: String
        optional :middle_name, type: String
        optional :last_name, type: String
        optional :address, type: String
        optional :birthday, type: Date
        optional :phone, type: String
        optional :picture, type: String
        optional :observations, type: String
        optional :email_other, type: String
        optional :urgent_contact, type: String
        optional :car_plate, type: String
        optional :assist_start_date, type: Date
        optional :courses_and_certifications, type: String
        optional :courses_date, type: Date
        optional :skills_level, type: String
        optional :skills_type, type: String
        optional :project_dates, type: Date
        optional :status, type: Integer
      end

      put "me" do
        authenticate!
        current_user.update(postParams)
        success
        return current_user
      end
  end
end

