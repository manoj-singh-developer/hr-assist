module V1
  class TechnologyAPI < Grape::API
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
          .permit(:name, :label)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :technologies do

      desc "Return all technologies"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Technology
      end

      desc "Returns a technology"
      params do
        requires :id ,type: Integer , desc: "technology id"
      end
      get ':id' do
        authorize! :read, Technology.find(params[:id])
      end

      desc "Create new technology"
      params do
        requires :name, allow_blank: false, type: String
        requires :label, allow_blank: false, type: String
      end
      post 'new' do
        authorizeAndCreate(Technology, postParams)
      end

      desc "Update technology"
      params do
        optional :name, allow_blank: false, type: String
        optional :label, allow_blank: false, type: String
      end

      put ':id' do
        technology = Technology.find(params[:id])
        authorize! :update, Technology
        technology.update(postParams)
        success
      end

      desc "Delete an technology"
      delete ':id' do
        Technology.find(params[:id]).destroy
      end
    end
  end
end
