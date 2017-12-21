module V1
  class UploadAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params)
          .permit(:file_name, :file_description, :path, :user_id)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end
    
    resource :uploads do

      desc "Get all uploads"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        authorize_admin!
        get_paginated_items_for Upload
      end

      desc "Get upload"
      params do
        requires :id, type: Integer , desc: "Upload id"
      end
      get ':id' do
        authorize_admin!
        authorize!(:read, Upload.find(params[:id]))
      end

      desc "Create new upload"
      params do
        requires :file_name, allow_blank: false, type: String
        requires :file_description, allow_blank: false, type: String
        requires :path, allow_blank: false, type: String
        requires :user_id, allow_blank: false, type: Integer
      end
      post 'new' do
        authorize_and_create(Upload, post_params) do
          User.find(post_params[:user_id])
        end
      end

      desc "Update upload"
      params do
        optional :file_name, allow_blank: false, type: String
        optional :file_description, allow_blank: false, type: String
        optional :path, allow_blank: false, type: String
      end
      put ':id' do
        authorize_admin!
        upload = Upload.find(params[:id])
        authorize! :update, Upload
        upload.update(post_params)
        success
      end
    end
  end
end
