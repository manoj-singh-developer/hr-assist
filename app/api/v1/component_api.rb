module V1
  class ComponentAPI < Grape::API

    version 'v1' , using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params).permit(:name)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end
    end

    before do
      authenticate!
    end

    resource :components do

      desc "Get all components"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for HardwareComponent
      end

    end
  end
end
