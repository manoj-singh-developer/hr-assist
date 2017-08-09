module V1
  module Users
    module Relations
      class UploadAPI < Grape::API
        version 'v1', using: :path
        format :json

        include RescuesAPI

        helpers do
          include Responses
          include APIHelpers
          include Authentication
          include AccessGranted::Rails::ControllerMethods
        end

        resource :users do

          before {
            authenticate!
            authorize_user!
          }

          desc "Get all user uploads"
          get ':user_id/uploads' do
            user = User.find(params[:user_id])
            { items: user.uploads }
          end

          get "Add uploads to user"
          params  do
            requires :upload_ids, type: [Integer], desc: "Upload ids"
          end
          put ':user_id/uploads' do
            user = User.find(params[:user_id])
            uploads = Upload.where(id: params[:upload_ids]) - user.uploads
            user.uploads << uploads if uploads.count > 0
            { items: user.uploads }
          end

          desc "Delete user uploads"
          delete ':user_id/uploads' do
            delete_object(User, Upload, params[:user_id], params[:upload_ids])
          end
        end
      end
    end
  end
end

