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

      def post_params
        ActionController::Parameters.new(params).permit(:long_name, :short_name)
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

      desc "Get all languages"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Language
      end

      desc "Get language"
      params do
        requires :id, type: Integer, desc: "Language ID"
      end
      get ':id' do
        authorize_admin!
        authorize!(:read, Language.find(params[:id]))
      end

      desc "Create new language"
      params do
        requires :long_name, allow_blank: false, type: String
        requires :short_name, allow_blank: false, type: String
      end
      post 'new' do
        authorize_admin!
        authorize_and_create(Language, post_params)
      end

      desc "Update language"
      params do
        optional :long_name, allow_blank: false, type: String
        optional :short_name, allow_blank: false, type: String
      end
      put ':id' do
        authorize_admin!
        language = Language.find(params[:id])
        authorize!(:update, Language)
        language.update(post_params)
        success
      end

      desc "Delete language"
      delete ':id' do
        authorize_admin!
        Language.find(params[:id]).destroy
      end
    end
  end
end
