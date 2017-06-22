module V1
  module Users
    module Relations
      class PositionAPI < Grape::API
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

          desc "Get all user positions"
          get ':user_id/position' do
            user = find_user(params[:user_id])
            user.positions.last ? user.positions.last : {}
          end

          desc "Add position to user"
          params do
            requires :position_id, type: Integer
          end
          put ':user_id/position' do
            user = User.find(params[:user_id])
            position = Position.find(params[:position_id])
            user.positions.delete_all
            user.positions << position
            user.positions.last
          end

          desc "Delete user position"
          params do
            requires :position_id, type: Integer
          end
          delete ':user_id/position' do
            user = find_user(params[:user_id])
            position = user.positions.find(params[:position_id])
            user.positions.delete_all
          end
        end
      end
    end
  end
end
