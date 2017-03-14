module V1
  class ProjectAPI < Grape::API
    helpers Defaults

    before do
      authenticate!
    end

    version 'v1', using: :path
    format :json

    resource :projects do

      desc "Return all projects"
      get do
        Project.all
      end

      params do
        requires :id, type: Integer , desc: "Project id"
      end

      desc "Returns a project"
      get ':id' do
        project = Project.find_by_id(params[:id])
        project ? project : {message: "Project not found"}
      end

      get ':id/customers' do
        Project.find_by_id(params[:id]).customers
      end

      get ':id/customers/:id_c/country' do
        customers = Project.find_by_id(params[:id]).customers
        customers.find_by_id(params[:id_c]).country
      end

      desc "Create new project"
      params do
        requires :name, type: String
        requires :description, type: String
        requires :start_date, type: Date
        requires :end_date, type: Date
        optional :deadline, type: Date
        optional :main_activities, type: String
        optional :url, type: String
        optional :assist_url, type: String
      end
      post 'new' do
        Project.create!(params)
        {success_message: "Project created"}
      end
    end
  end
end
