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
      error!('401 Access Denied', 401) unless current_user.is_admin
    end

    resource :uploads do

      desc "Get all uploads"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Upload
      end

      desc "Get upload"
      params do
        requires :id, type: Integer , desc: "Upload id"
      end
      get ':id' do
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
        upload = Upload.find(params[:id])
        authorize! :update, Upload
        upload.update(post_params)
        success
      end
    end
  end
end
