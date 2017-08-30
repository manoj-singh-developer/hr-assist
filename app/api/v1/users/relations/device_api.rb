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
            authorize_user!
          }

          desc "Get all user devices"
          get ':user_id/devices' do
            user = User.find(params[:user_id])
            {items: user.get_devices}
          end

          desc "Add devices to user"
          params do
            requires :device_name, type: String, desc: "Device name"
            requires :components, type: [String], desc: "Components"
          end
          put ':user_id/devices' do
            user = User.find(params[:user_id])
            Device.create(name: params[:device_name], user_id: user.id)
            components = HardwareComponent.where(name: params[:components])
            components.each do |component|
              UserDeviceSpecification.create(device_id: Device.last.id, hardware_component_id: component.id)
            end
            { items: user.get_devices }
          end

          desc "Delete user devices"
          delete ':user_id/devices' do
            delete_object(User, Device, params[:user_id], params[:device_ids])
          end
        end
      end
    end
  end
end
