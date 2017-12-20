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

      def post_params
        ActionController::Parameters.new(params).permit(:name, :label)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authorize_admin!
    end

    resource :technologies do

      desc "Get all technologies"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Technology
      end

      desc "Get technology"
      params do
        requires :id ,type: Integer , desc: "technology id"
      end
      get ':id' do
        authorize!(:read, Technology.find(params[:id]))
      end

      desc "Get all technology projects"
      get ':id/projects' do
        technology = Technology.find(params[:id])
        projects = technology.projects
        projects
      end

      desc "Delete technology projects"
      params do
        requires :project_ids, type: [Integer], desc: "Project ids"
      end
      delete ':id/projects' do
        delete_object(Technology, Project, params[:id], params[:project_ids])
      end

      desc "Get all technology users"
      get ':id/users' do
        technology = Technology.find(params[:id])
        technology.user_technologies.map do |user_tech|
          {
            user: user_tech.user,
            technology_level: user_tech.level
          }
        end
      end

      desc "Delete technology users"
      params do
        requires :user_ids, type: [Integer], desc: "User ids"
      end
      delete ':id/users' do
        delete_object(Technology, User, params[:id], params[:user_ids])
      end

      desc "Create new technology"
      params do
        requires :name, allow_blank: false, type: String
        requires :label, allow_blank: false, type: String
      end
      post 'new' do
        if params[:items]
          params[:items].each do |value|
            authorize_and_create(Technology, { name: value[:name], label: value[:label], creator_id: current_user.id })
          end
        else
          tech_params = { name: post_params[:name], label: post_params[:label], creator_id: current_user.id }
          authorize_and_create(Technology, tech_params)
        end
      end

      desc "Update technology"
      params do
        optional :name, allow_blank: false, type: String
        optional :label, allow_blank: false, type: String
      end
      put ':id' do
        technology = Technology.find(params[:id])
        authorize!(:update, Technology)
        technology.update(post_params)
        success
      end

      desc "Delete an technology"
      delete ':id' do
        Technology.find(params[:id]).destroy
      end
    end
  end
end
