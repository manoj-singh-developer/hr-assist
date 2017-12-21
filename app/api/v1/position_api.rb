module V1
  class PositionAPI < Grape::API
    version 'v1' , using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params).permit(:name, :job_detail)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :positions do

      desc "Get all positions"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Position
      end

      desc "Get project"
      params do
        requires :id , type: Integer, desc: "Position ID"
      end
      get ':id' do
        authorize_admin!
        authorize!(:read, Position.find(params[:id]))
      end

      desc "Create new position"
      params do
        requires :name, allow_blank: false, type: String
        requires :job_detail, allow_blank: false, type: String
      end
      post 'new' do
        authorize_admin!
        authorize_and_create(Position, post_params)
      end

      desc "Update position"
      params do
        optional :name, allow_blank: false, type: String
        optional :job_detail, allow_blank: false, type: String
      end
      put ':id' do
        authorize_admin!
        position = Position.find(params[:id])
        authorize!(:update, Position)
        position.update(post_params)
        success
      end

      desc "Delete position"
      delete ':id' do
        authorize_admin!
        Position.find(params[:id]).destroy
      end
    end
  end
end
