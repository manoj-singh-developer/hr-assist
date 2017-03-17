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

      def postParams
        ActionController::Parameters.new(params)
          .permit(:name, :job_detail)
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

      desc "Return all positions"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Position
      end

      desc "Returns a project"
      params do
        requires :id , type: Integer, desc: "Position ID"
      end
      get ':id' do
        authorize! :read, Position.find(params[:id])
      end

      desc "Create new position"
      params do
        requires :name, allow_blank: false, type: String
        requires :job_detail, allow_blank: false, type: String
      end
      post 'new' do
        authorizeAndCreate Position postParams
      end
      
    end
  end
end