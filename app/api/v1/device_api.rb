module V1
  class DeviceAPI < Grape::API

    version 'v1' , using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params).permit(:name, :user_id, :serial_number)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

      def filtered_devices(filters)
        devices = Device.all.by_component(filters[:component])
        users_devices = devices
          .map(&:user).uniq
          .map(&:get_all_devices)

        { items: users_devices }
      end
    end

    before do
      authenticate!
    end

    resource :devices do

      desc "Get all devices, roles: user/admin"
      get do
        if params[:filters]
         filtered_devices(params[:filters])
        else
          users_devices = User.all
            .reject{ |user| user.devices.empty? }
            .map(&:get_all_devices)
          { items: users_devices }
        end
      end

      desc "Get device, role: admin"
      params do
        requires :id , type: Integer , desc: "Device ID"
      end
      get ':id' do
        authorize!(:read, Device.find(params[:id]))
      end

      desc "Get all device users, role: admin"
      get ':id/users' do
        authorize_admin!
        device = Device.find(params[:id])
        {items: device.users}
      end

      desc 'Create new device, role: admin

      {"name": "device_name", "serial_number": "111111"}'
      params do
        requires :name, allow_blank: false, type: String
        optional :serial_number, allow_blank: false, type: String
      end
      post 'new' do

        if params[:items]
          params[:items].each do |item|
            authorize_and_create(Device, {name: item[:name] , serial_number: item[:serial_number]})
          end
        else
          authorize_and_create(Device, post_params)
        end
      end

      desc 'Update device, role:admin 

      {"id": "1", name": "device_name", "serial_number": "111111"}'
      params do
        optional :name, allow_blank: false, type: String
        optional :serial_number, allow_blank: false, type: String
      end
      put ':id' do
        authorize_admin!
        device = Device.find(params[:id])
        authorize!(:update, Device)
        device.update(post_params)
        success
      end

      desc "Delete device"
      delete ':id' do
        authorize_admin!
        Device.find(params[:id]).destroy
      end
    end
  end
end
