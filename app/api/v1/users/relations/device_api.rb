module V1
  module Users
    module Relations
      class DeviceAPI < Grape::API
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
            authorize_user!(find_user(params[:user_id]))
          }

          get ':user_id/devices' do
            user = find_user(params[:user_id])
            { items: user.devices }
          end

          put ':user_id/devices' do
            user = User.find(params[:user_id])
            devices = Device.where(id: params[:device_ids]) - user.devices
            user.devices << devices if devices.count > 0
            { items: user.devices }
          end
        end
      end
    end
  end
end
