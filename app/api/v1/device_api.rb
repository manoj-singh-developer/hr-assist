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
        ActionController::Parameters.new(params).permit(:name, :user_id)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end
    end

    before do
      authenticate!
    end

    resource :devices do

      desc "Get all devices"
      get do
        users = User.all
        result = []
        users.each do |user|
         result << user.get_all_devices if Device.where(user_id: user.id).exists?
        end
        { items: result }
      end


      desc "Get device"
      params do
        requires :id , type: Integer , desc: "Device ID"
      end
      get ':id' do
        authorize!(:read, Device.find(params[:id]))
      end

      desc "Get all device users"
      get ':id/users' do
        device = Device.find(params[:id])
        {items: device.users}
      end

      desc "Create new device"
      params do
        requires :name, allow_blank: false, type: String
        requires :description, allow_blank: false, type: String
        requires :total, allow_blank: false, type: Integer
      end
      post 'new' do
        if params[:items]
          params[:items].each do |x|
            authorize_and_create(Device, {name: x[:name] , description: x[:description], total: x[:total]})
          end
        else
          authorize_and_create(Device, post_params)
        end
      end

      desc "Update device"
      params do
        optional :name, allow_blank: false, type: String
        optional :description, allow_blank: false, type: String
        optional :total, allow_blank: false, type: Integer
      end
      put ':id' do
        device = Device.find(params[:id])
        authorize!(:update, Device)
        device.update(post_params)
        success
      end

      desc "Delete device"
      delete ':id' do
        Device.find(params[:id]).destroy
      end
    end
  end
end
