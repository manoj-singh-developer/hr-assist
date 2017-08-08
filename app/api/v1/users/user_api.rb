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
                    :other_email, :urgent_contact_name, :urgent_contact_phone, :car_plate, :company_start_date, :status, :email, :office_nr, :cnp)
        end

        def filtered_users filters

            users = User.where(nil)

            users = users.by_month_birth(filters[:birthday].to_date) if filters[:birthday]
            users = users.by_university_year(filters[:university_year].to_i) if filters[:university_year]
            users = users.by_company_start_date_until_present(filters[:start_date].to_date) if filters[:start_date]
            users = users.by_projects(filters[:projects]) if filters[:projects]
            users = users.by_certifications(filters[:certifications]) if filters[:certifications]
            users = users.by_technology_id_and_level(filters[:technologies].values.map(&:technology_id).zip(filters[:technologies].values.map(&:technology_level))) if filters[:technologies]
            users = users.by_language_id_and_level(filters[:languages].values.map(&:language_id).zip(filters[:languages].values.map(&:language_level))) if filters[:languages]

            users
        end

        params :pagination do
          optional :page, type: Integer
          optional :per_page, type: Integer
        end
      end

      resource :users do

        before { authenticate! }

        desc "Return all users"
        params do
          use :pagination # aliases: includes, use_scope
          optional :with, values: ['positions', 'languages', 'devices', 'educations', 'departments', 'projects', 'technologies', 'certifications', 'work_info'], type: [String]
          optional :filters, type: Hash
        end
        get do

          if current_user.is_employee

              params[:with] = []
              exceptions = [
                "address", "birthday", "car_plate", "city",
                "company_start_date", "observations", "office_nr",
                "phone", "picture", "schedule_id", "status", "uid",
                "urgent_contact_name", "urgent_contact_phone", "zip_code",
                "auth_token"
              ]
          end

          if params[:filters]
            paginateItems filtered_users(params[:filters]), params[:with] , defined?(exceptions) ? exceptions : []
          else
            getPaginatedItemsFor User, params[:with] , defined?(exceptions) ? exceptions : []
          end

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
          user.as_json(include: { work_info: { except: [:id, :user_id] } })
        end

        desc "Update user by id"
        params do
          optional :cnp, type: String
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
          if params[:work_info]
            user.work_info ||= WorkInfo.create(user_id: user.id)
            params[:work_info].each do |key,value|
              user.work_info.update(key.to_sym => value)
            end
          end
          user.as_json(include: { work_info: { except: [:id, :user_id] } })
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
        optional :cnp, type: String
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
