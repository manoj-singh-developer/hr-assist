module V1
  class CountryAPI < Grape::API
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
          .permit(:long_name, :short_name)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :countries do

      desc "Return all countries"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Country
      end

      desc "Returns a country"
      params do
        requires :id, type: Integer , desc: "Country id"
      end
      get ':id' do
        authorize! :read, Country.find(params[:id])
      end

      desc "Create new country"
      params do
        requires :long_name, allow_blank: false, type: String
        requires :short_name, allow_blank: false, type: String
      end
      post 'new' do
        authorizeAndCreate(Country, postParams)
      end

      desc "Update country"
      params do
        optional :long_name, allow_blank: false, type: String
        optional :short_name, allow_blank: false, type: String
      end

      put ':id' do
        country = Country.find(params[:id])
        authorize! :update, Country
        country.update(postParams)
        success
      end
    end
  end
end
