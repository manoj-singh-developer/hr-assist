module V1
  class EquipmentAPI < Grape::API

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

    resource :equipments do

      desc "Return all equipments"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Equipment
      end

      desc "Returns an equipment"
      params do
        requires :id , type: Integer , desc: "Equipment ID"
      end
      get ':id' do
        authorize! :read, Equipment.find(params[:id])
      end

      desc "Create new equipment"
      params do
        requires :name, allow_blank: false, type: String
        requires :description, allow_blank: false, type: String
        requires :total, allow_blank: false, type: Integer
      end
      post 'new' do
        authorizeAndCreate Equipment postParams
      end
      
    end
  end
end