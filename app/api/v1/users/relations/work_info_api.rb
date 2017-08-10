module V1
  module Users
    module Relations
      class WorkInfoAPI < Grape::API
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

          desc 'Get work information'
          get ':user_id/info' do
            user = User.find(params[:user_id])
            { items: user.work_info }
          end

          desc 'Create new work info'
          params do
            requires :info, type: Hash, desc: 'Array of info objects'
          end

          post ':user_id/info' do
            user = User.find(params[:user_id])

            user_work_info = WorkInfo.create(
              ssh_public_key:           params[:info].ssh_public_key,
              bitbucket:                params[:info].bitbucket,
              github:                   params[:info].github,
              user_id: user.id
            )
            user.work_info = user_work_info

            { items: user.work_info }
          end

          desc 'Update new info'
          params do
            requires :info, type: Hash, desc: 'Array of info objects'
          end
          put ':user_id/info' do
            user = User.find(params[:user_id])

            params[:info].each do |key,value|
              user.work_info.update(key.to_sym => value)
            end

            { items: user.work_info }
          end

        end
      end
    end
  end
end
