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

      get ':user_id/devices' do
        user = find_user(params[:user_id])
        {items: user.as_json(include: :devices)}
      end

      put ':user_id/devices' do
        user = User.find(params[:user_id])
        devices = Device.where(id: params[:device_ids]) - user.devices
        user.devices << devices if devices.count > 0
        {items: user.as_json(include: :devices)}
      end

      delete ':user_id/devices' do
        delete_object(User, Device, params[:user_id], params[:device_ids])
      end

      get ':user_id/languages' do
        user = find_user(params[:user_id])
        {items: user.as_json(include: :languages)}
      end

      put ':user_id/languages' do
        user = User.find(params[:user_id])
        languages = Language.where(id: params[:language_ids]) - user.languages
        user.languages << languages if languages.count > 0
        {items: user.as_json(include: :languages)}
      end

      delete ':user_id/languages' do
        delete_object(User, Language, params[:user_id], params[:language_ids])
      end

      get ':user_id/positions' do
        user = find_user(params[:user_id])
        {items: user.as_json(include: :positions)}
      end

      put ':user_id/positions' do
        user = User.find(params[:user_id])
        positions = Position.where(id: params[:position_ids]) - user.positions
        user.positions << positions if positions.count > 0
        {items: user.as_json(include: :positions)}
      end

      delete ':user_id/positions' do
        delete_object(User, Position, params[:user_id], params[:position_ids])
      end

      get ':user_id/educations' do
        user = find_user(params[:user_id])
        {items: user.as_json(include: :educations)}
      end

      params do
        requires :name, type: String,  allow_blank: false
        requires :degree, type: String, allow_blank: false
        requires :description, type: String, allow_blank: false
        requires :start_date, type: Date, allow_blank: false
        requires :end_date, type: Date, allow_blank: false
      end
      post ':user_id/educations' do
        education = Education.create(user_education_params)
        user = find_user(params[:user_id])
        user.educations << education
        {items: user.as_json(include: :educations)}
      end

      put ':user_id/educations' do
        user = User.find(params[:user_id])
        educations = Education.where(id: params[:education_ids]) - user.educations
        user.educations << educations if educations.count > 0
        {items: user.as_json(include: :educations)}
      end

      delete ':user_id/educations' do
        delete_object(User, Education, params[:user_id], params[:education_ids])
      end

      get ':user_id/uploads' do
        user = find_user(params[:user_id])
        {items: user.as_json(include: :uploads)}
      end

      get ':user_id/schedule' do
        user = find_user(params[:user_id])
        user.as_json(include: :schedule)
      end

      params do
        optional :name, type: String
        optional :timetable, type: String
      end
      put ':user_id/schedule/:schedule_id' do
        schedule = Schedule.find_or_create_by(id: params[:schedule_id]) do |schedule|
          schedule.name = params[:name]
          schedule.timetable = params[:timetable]
        end
        schedule.update(user_schedule_params)
        user = find_user(params[:user_id])
        user.schedule = schedule
        user.as_json(include: :schedule)
      end

      get ':user_id/projects' do
        user = find_user(params[:user_id])
        {items: user.projects}
      end

      params do
        optional :start_date, type: Date
        optional :end_date, type: Date
        optional :technology_ids, type: Array[Integer]
      end

      put ':user_id/projects/:project_id' do
        user = find_user(params[:user_id])
        user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
        user_project = UserProject.create(user_id: params[:user_id], project_id: params[:project_id]) if user_project.nil?
        user_project.update(user_project_params)
        technologies = Technology.where(id: params[:technology_ids]) - user_project.technologies
        user_project.technologies << technologies if technologies.count > 0
        user_project.as_json(include: :technologies)
      end

      get ':user_id/technologies' do
        user = find_user(params[:user_id])
        {items: user.as_json(include: :technologies)}
      end

      put ':user_id/technologies' do
        user = User.find(params[:user_id])
        technologies = Technology.where(id: params[:technology_ids]) - user.technologies
        user.technologies << technologies if technologies.count > 0
        {items: user.as_json(include: :technologies)}
      end

      delete ':user_id/technologies' do
        delete_object(User, Technology, params[:user_id], params[:technology_ids])
      end

      get ':user_id/holidays' do
        user = find_user(params[:user_id])
        {items: user.as_json(include: :holidays)}
      end
      post ':user_id/holidays/:id' do
        user = add_object_for_user(Holiday, params)
        {items: user.as_json(include: :holidays)}
      end

      get ':user_id/holiday_replacements' do
        user = find_user(params[:user_id])
        {items: user.holiday_replacements}
      end

      desc "Update user by id"
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
        optional :upload_ids, type: Array[Integer]
      end
      put ':id' do
        user = User.find(params[:id])
        authorize! :update, User
        user.update(postParams)
        success
        return user
      end

      put ':user_id/uploads' do
        user = User.find_by_id(params[:user_id])
        uploads = Upload.where(id: params[:upload_ids]) - user.uploads
        user.uploads << uploads if uploads.count > 0
        {items: user.as_json(include: :uploads)}
      end

      delete ':user_id/uploads' do
        delete_object(User, Upload, params[:user_id], params[:upload_ids])
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

