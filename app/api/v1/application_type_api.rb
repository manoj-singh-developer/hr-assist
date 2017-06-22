module V1
  class ApplicationTypeAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def postParams
        ActionController::Parameters.new(params).permit(:name, :label)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :application_types do

      desc "Get all application types"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor ApplicationType
      end

      desc "Get application type"
      params do
        requires :id, type: Integer , desc: "Application type id"
      end
      get ':id' do
        authorize! :read, ApplicationType.find(params[:id])
      end

      desc "Get all application type projects"
      get ':id/projects' do
        application_type = ApplicationType.find_by_id(params[:id])
        projects = application_type.projects
        {items: projects}
      end

      desc "Delete application type projects"
      params do
        requires :project_ids, type: Array[Integer], desc: "Projects ids"
      end
      delete ':id/projects' do
        delete_object(ApplicationType, Project, params[:id], params[:project_ids])
      end

      desc "Create new application type"
      params do
        requires :name, allow_blank: false, type: String
        requires :label, allow_blank: false, type: String
      end
      post 'new' do
        if params[:items]
          params[:items].each do |x|
            authorizeAndCreate(ApplicationType, {name: x[:name] , label: x[:label]})
          end
        else
          authorizeAndCreate(ApplicationType, postParams)
        end
      end

      desc "Update application type"
      params do
        optional :name, allow_blank: false, type: String
        optional :label, allow_blank: false, type: String
      end
      put ':id' do
        application_type = ApplicationType.find(params[:id])
        authorize! :update, ApplicationType
        application_type.update(postParams)
        success
      end

      desc "Delete application type"
      delete ':id' do
        ApplicationType.find(params[:id]).destroy
      end
    end
  end
end
