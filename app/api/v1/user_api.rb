module V1
  class UserAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do

      include Responses
      include APIHelpers

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

    end

    resource :users do

      desc "Return all users"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor User
      end

      desc "Returns a user"
      params do
        requires :id, type: Integer , desc: "User id"
      end
      get ':id' do
        authenticate!
        authorize! :read, User.find(params[:id])
      end

      get ':id/devices' do
        user = User.find_by_id(params[:id])
        user.devices.any? ? user.devices : nil_error("devices")
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
    
      desc "User login"

      params do
        requires :email, type: String
        requires :password, type: String
      end
      post "login" do
        result = ldap_login

        if result
          createUser result
        else
          error({ message: "Authentication FAILED." })
        end
      end
  end
end

