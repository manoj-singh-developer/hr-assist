module V1
  class ActivityAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params).permit(:name, :description)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end
    end

    before do
      authorize_admin!
    end

    resource :activities do

      desc "Get all activities, role: admin"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Activity
      end

      desc 'Get activity, role: admin'
      params do
        requires :id ,type: Integer , desc: "activity id"
      end
      get ':id' do
        authorize!(:read, Activity.find(params[:id]))
      end

      desc 'Create new activity, role: admin 

      { "name": "activity_name", "description": "activity_description" }'
      params do
        requires :name, allow_blank: false, type: String
        requires :description, allow_blank: false, type: String
      end
      post 'new' do
        authorize_and_create(Activity, post_params)
      end

      desc 'Update activity, role: admin

      { "id": "1", "name": "activity_name", "description": "activity_description" }'
      params do
        optional :name, allow_blank: false, type: String
        optional :description, allow_blank: false, type: String
      end
      put ':id' do
        activity = Activity.find(params[:id])
        authorize!(:update, Activity)
        activity.update(post_params)
        success
      end

      desc 'Delete activity, role: admin

      {"id": "1"}'
      delete ':id' do
        Activity.find(params[:id]).destroy
      end
    end
  end
end
