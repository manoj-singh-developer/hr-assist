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

      desc "Get all projects"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Project, params[:with]
      end

      desc "Get project"
      params do
        requires :id, type: Integer , desc: "Project id"
      end
      get ':id' do
        authorize! :read, Project.find(params[:id])
      end

      desc "Get all project application types"
      get ':project_id/application_types' do
        {items: project_with("application_types", params)}
      end

      desc "Get all project activities"
      get ':project_id/activities' do
        {items: project_with("activities", params)}
      end

      desc "Get all project industries"
      get ':project_id/industries' do
        {items: project_with("industries", params)}
      end

      desc "Get all project technologies"
      get ':project_id/technologies' do
        {items: project_with("technologies", params)}
      end

      desc "Get all project customers"
      get ':project_id/customers' do
        {items: project_with("customers", params)}
      end

      desc "Get all project users"
      get ':project_id/users' do
        {items: project_with("users", params)}
      end

      desc "Create new project"
      params do
        requires :name, allow_blank: false, type: String
        optional :description, allow_blank: true, type: String
        requires :start_date, allow_blank: false, type: Date
        optional :end_date, allow_blank: true, type: Date
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
        optional :end_date, allow_blank: true, type: Date
        optional :deadline, type: Date
        optional :main_activities, type: String
        optional :url, type: String
        optional :assist_url, type: String
        optional :technology_ids, type: Array[Integer]
        optional :application_type_ids, type: Array[Integer]
        optional :industry_ids, type: Array[Integer]
        optional :customer_ids, type: Array[Integer]
      end
      put ':id' do
        project = Project.find(params[:id])
        authorize! :update, Project
        project.update(postParams)
        success
      end

      #TODO refactor put routes

      desc "Add technologies to project"
      params do
        requires :technology_ids, type: [Integer], desc: "Technology ids"
      end
      put ':id/technologies' do
        project = Project.find_by_id(params[:id])
        technologies = Technology.where(id: params[:technology_ids]) - project.technologies
        project.technologies << technologies if technologies.count > 0
        {items: project.technologies}
      end

      desc "Delete project technologies"
      params do
        requires :technology_ids, type: [Integer], desc: "Technology ids"
      end
      delete ':id/technologies' do
        delete_object(Project, Technology, params[:id], params[:technology_ids])
      end

      desc "Add application types to project"
      params do
        requires :application_type_ids, type: [Integer], desc: "ApplicationType ids"
      end
      put ':id/application_types' do
        project = Project.find_by_id(params[:id])
        application_types = ApplicationType.where(id: params[:application_type_ids]) - project.application_types
        project.application_types << application_types if application_types.count > 0
        {items: project.application_types}
      end

      desc "Delete project application types"
      params do
        requires :application_type_ids, type: [Integer], desc: "ApplicationType ids"
      end
      delete ':id/application_types' do
        delete_object(Project, ApplicationType, params[:id], params[:application_type_ids])
      end

      desc "Add industries to project"
      params do
        requires :industry_ids, type: [Integer], desc: "Industry ids"
      end
      put ':id/industries' do
        project = Project.find_by_id(params[:id])
        industries = Industry.where(id: params[:industry_ids]) - project.industries
        project.industries << industries if industries.count > 0
        {items: project.industries}
      end

      desc "Delete project industries"
      params do
        requires :industry_ids, type: [Integer], desc: "Industry ids"
      end
      delete ':id/industries' do
        delete_object(Project, Industry, params[:id], params[:industry_ids])
      end

      desc "Add customers to project"
      params do
        requires :customer_ids, type: [Integer], desc: "Customer ids"
      end
      put ':id/customers' do
        project = Project.find_by_id(params[:id])
        customers = Customer.where(id: params[:customer_ids]) - project.customers
        project.customers << customers if customers.count > 0
        {items: project.customers}
      end

      desc "Delete project customers"
      params do
        requires :customer_ids, type: [Integer], desc: "Customer ids"
      end
      delete ':id/customers' do
        delete_object(Project, Customer, params[:id], params[:customer_ids])
      end

      desc "Add users to project and edit team leader" # this have two responsabilities and should be separated
      params do
        requires :user_ids, type: Array[Integer], allow_blank: false, desc: "User ids"
        optional :team_leader_id, type: Integer, desc: "Team leader id (user)"
      end
      put ':id/users' do
        project = Project.find(params[:id])
        if params[:team_leader_id]
           project.team_leader_id = params[:team_leader_id]
           project.save
        end
        users = User.where(id: params[:user_ids]) - project.users
        project.users << users if users.count > 0
        {items: project.users}
      end

      desc "Delete project users"
      params do
        requires :user_ids, type: Array[Integer], allow_blank: false, desc: "User ids"
      end
      delete ':id/users' do
        delete_object(Project, User, params[:id], params[:user_ids])
      end

      desc "Delete project"
      delete ':id' do
        Project.find(params[:id]).destroy
      end
    end
  end
end
