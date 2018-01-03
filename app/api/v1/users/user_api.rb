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

        def post_params
          ActionController::Parameters.new(params)
            .permit(:first_name, :middle_name, :last_name, :address, :city, :zip_code, :birthday, :phone, :picture, :observations,
                    :other_email, :urgent_contact_name, :urgent_contact_phone, :car_plate, :company_start_date, :status, :email, :office_nr, :cnp,
                    :company_end_date, :encrypted_password )
        end

        def filtered_users filters
          users = User.where(company_end_date: nil, is_active: true)

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
          optional :with, values: ['positions', 'languages', 'devices', 'educations', 'departments', 'projects', 'technologies', 'certifications', 'work_info', 'cnp'], type: [String]
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
              "auth_token", "work_info", "cnp", "company_end_date", "is_active", "reg_status"
            ]
          end
          if params[:filters]
            paginate_items filtered_users(params[:filters]), params[:with] , defined?(exceptions) ? exceptions : []
          else
            get_paginated_items_for User.where(company_end_date: nil, is_active: true), params[:with] , defined?(exceptions) ? exceptions : []
          end

        end

        desc "Returns a user"
        params do
          requires :id, type: Integer , desc: "User id"
        end
        get ':id' do
          authorize! :read, User
          user = User.find(params[:id])
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
          optional :company_end_date, type: Date
          optional :status, type: Integer
          optional :city, type: String
          optional :zip_code, type: String
          optional :office_nr, type: String
          optional :urgent_contact_phone, type: String
          optional :upload_ids, type: Array[Integer]
        end
        put ':user_id' do
          authorize_user!
          user = User.find(params[:user_id])
          authorize! :update, User
          user.update(post_params)
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
        allowed_domains = Domain.all.pluck(:allowed_domain)
        result = ldap_login
        if result
          create_user(result.first)
        elsif allowed_domains.include?(params[:email].partition('@').last)
          user = User.find_by_email(params[:email])
          if user
            error!('Incorrect Password', 401) if user[:encrypted_password].present? && decrypt(user[:encrypted_password]) != params[:password]
            if user[:reg_status] == "confirmed"
              login_non_ldap_user(user)
            elsif user[:reg_status] == "pending"
            error!({ message: "Your account is not confirmed." })
            end
          else
            new_user = User.new(email: params[:email], password: params[:password], reg_status: "pending") if User.where(reg_status: "pending").count < 20
            new_user[:encrypted_password] = encrypt(params[:password])
            new_user.save
            success(user: user)
          end
        else
          error!({ message: "Authentication FAILED." })
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
        optional :company_end_date, type: Date
        optional :status, type: Integer
        optional :city, type: String
        optional :zip_code, type: String
        optional :office_nr, type: String
        optional :urgent_contact_phone, type: String
        optional :cnp, type: String
      end

      put "me" do
        authenticate!
        current_user.update(post_params)
        success
        return current_user
      end
    end
  end
end
