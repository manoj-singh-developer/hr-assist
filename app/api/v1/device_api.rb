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

      def postParams
        ActionController::Parameters.new(params)
          .permit(:name, :description, :total)
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

      desc "Return all devices"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Device
      end

      desc "Returns a device"
      params do
        requires :id , type: Integer , desc: "Device ID"
      end
      get ':id' do
        authorize! :read, Device.find(params[:id])
      end

      desc "Create new device"
      params do
        requires :name, allow_blank: false, type: String
        requires :description, allow_blank: false, type: String
        requires :total, allow_blank: false, type: Integer
      end
      post 'new' do
        authorizeAndCreate Device postParams
      end
    end
  end
end
