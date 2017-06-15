module V1
  module Users
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
            .permit(:first_name, :middle_name, :last_name, :address, :city, :zip_code, :birthday, :phone, :picture, :observations,
                    :other_email, :urgent_contact_name, :urgent_contact_phone, :car_plate, :company_start_date, :status, :email, :office_nr)
        end

        params :pagination do
          optional :page, type: Integer
          optional :per_page, type: Integer
        end

        params :other do
          optional :with, values: ['positions', 'user_languages', 'devices', 'educations', 'departments', 'projects', 'technologies'], type: Array[String]
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

          if current_user.is_employee
              
              params[:with] = []
              exceptions = [
                "address", "birthday", "car_plate", "city",
                "company_start_date", "observations", "office_nr",
                "phone", "picture", "schedule_id", "status", "uid",
                "urgent_contact_name", "urgent_contact_phone", "zip_code",
                "auth_token"]
          end

          getPaginatedItemsFor User, params[:with] , defined?(exceptions) ? exceptions : []
        end

        desc "Returns a user"
        params do
          requires :id, type: Integer , desc: "User id"
        end
        get ':id' do
          authorize! :read, User
          user = find_user(params[:id])
          if(current_user.is_employee && current_user.id != user.id )
            return error({message: "Cannot access another user"})
          end
          user
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
          optional :other_email, type: String
          optional :urgent_contact_name, type: String
          optional :car_plate, type: String
          optional :company_start_date, type: Date
          optional :status, type: Integer
          optional :city, type: String
          optional :zip_code, type: String
          optional :office_nr, type: String
          optional :urgent_contact_phone, type: String
          optional :upload_ids, type: Array[Integer]
        end
        put ':id' do
          user = User.find(params[:id])
          authorize! :update, User
          user.update(postParams)
          success
          return user
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
        optional :other_email, type: String
        optional :urgent_contact_name, type: String
        optional :car_plate, type: String
        optional :company_start_date, type: Date
        optional :status, type: Integer
        optional :city, type: String
        optional :zip_code, type: String
        optional :office_nr, type: String
        optional :urgent_contact_phone, type: String
      end

      put "me" do
        authenticate!
        current_user.update(postParams)
        success
        return current_user
      end
    end
  end
end
