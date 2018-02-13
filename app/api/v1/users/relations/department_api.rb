module V1
  module Users
    module Relations
      class DepartmentAPI < Grape::API
        version 'v1', using: :path
        format :json

        include RescuesAPI

        helpers do
          include Responses
          include APIHelpers
          include Authentication
          include AccessGranted::Rails::ControllerMethods
        end

        resource :users do

          before {
            authenticate!
            authorize_user!
          }

          desc "Get user department"
          get ':user_id/department' do
            user = User.find(params[:user_id])
            user.department
          end

          desc 'Create user department

          { "department_id": "30" }'
          params do
            requires :department_id, type: Integer
          end
          post ':user_id/department/new' do
            user = User.find(params[:user_id])
                department_id = Department.find_by(id: params[:department_id])
                user_department = UserDepartment.find_or_create_by(
                  department_id: department_id[:id],
                  user_id: params[:user_id]
                  )
                user_department.save!

            { items: user.department }
          end
        end
      end
    end
  end
end
