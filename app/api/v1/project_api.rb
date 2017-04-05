module V1
  class ProjectAPI < Grape::API
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
          .permit(:name, :description, :start_date, :end_date, :deadline, :main_activities, :url, :assist_url)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :projects do

      desc "Return all projects"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Project, params[:with]
      end

      desc "Returns a project"
      params do
        requires :id, type: Integer , desc: "Project id"
      end
      get ':id' do
        authorize! :read, Project.find(params[:id])
      end

      desc "Create new project"
      params do
        requires :name, allow_blank: false, type: String
        requires :description, allow_blank: false, type: String
        requires :start_date, allow_blank: false, type: Date
        requires :end_date, allow_blank: false, type: Date
        optional :deadline, type: Date
        optional :main_activities, type: String
        optional :url, type: String
        optional :assist_url, type: String
      end
      post 'new' do
        authorizeAndCreate(Project, postParams)
      end

      desc "Update project"
      params do
        optional :name, allow_blank: false, type: String
        optional :description, allow_blank: false, type: String
        optional :start_date, allow_blank: false, type: Date
        optional :end_date, allow_blank: false, type: Date
        optional :deadline, type: Date
        optional :main_activities, type: String
        optional :url, type: String
        optional :assist_url, type: String
      end

      put ':id' do
        project = Project.find(params[:id])
        authorize! :update, Project
        project.update(postParams)
        success
      end

      desc "Delete project"
      delete ':id' do
        Project.find(params[:id]).destroy
      end
    end
  end
end
