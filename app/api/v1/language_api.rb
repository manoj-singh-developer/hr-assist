module V1
  class LanguageAPI < Grape::API
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

    resource :languages do

      desc "Return all languages"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Language
      end

      desc "Returns a language"
      params do
        requires :id, type: Integer, desc: "Language ID"
      end
      get ':id' do
        authorize! :read, Language.find(params[:id])
      end

      desc "Create new language"
      params do
        requires :long_name, allow_blank: false, type: String
        requires :short_name, allow_blank: false, type: String
      end
      post 'new' do
        authorizeAndCreate Language postParams
      end
      
    end
  end
end