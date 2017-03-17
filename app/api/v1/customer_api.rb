module V1
  class CustomerAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def postParams
        ActionController::Parameters.new(params)
          .permit(:name, :country_id)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end
    
    before do
      authenticate!
    end

    resource :customers do

      desc "Return all curstomers"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Customer
      end

      desc "Returns a customer"
      params do
        requires :id ,type: Integer , desc: "Customer id"
      end
      get ':id' do
        authorize! :read, Customer.find(params[:id])
      end

      desc "Create new customer"
      params do
        requires :name, allow_blank: false, type: String
        requires :country_id, allow_blank: false, type: Integer
      end
      post 'new' do
        authorizeAndCreate Customer postParams do
          Country.find(postParams[:country_id])          
        end
      end

    end
  end
end
