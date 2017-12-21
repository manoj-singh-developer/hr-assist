module V1
  class IndustryAPI < Grape::API
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
      authenticate!
    end

    resource :industries do

      desc "Get all industries"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Industry
      end

      desc "Get industry"
      params do
        requires :id ,type: Integer , desc: "Industry id"
      end
      get ':id' do
        authorize!(:read, Industry.find(params[:id]))
      end

      desc "Get all industry projects"
      get ':id/projects' do
        authorize_admin!
        industry = Industry.find(params[:id])
        projects = industry.projects
        {items: projects}
      end

      desc "Delete industry projects"
      params do
        requires :project_ids, type: [Integer], desc: "Project ids"
      end
      delete ':id/projects' do
        authorize_admin!
        delete_object(Industry, Project, params[:id], params[:project_ids])
      end

      desc "Create new industry"
      params do
        requires :name, allow_blank: false, type: String
        requires :label, allow_blank: false, type: String
      end
      post 'new' do
        authorize_admin!
        if params[:items]
          params[:items].each do |item|
            authorize_and_create(Industry, {name: item[:name] , label: item[:label]})
          end
        else
          authorize_and_create(Industry, post_params)
        end
      end

      desc "Update industry"
      params do
        optional :name, allow_blank: false, type: String
        optional :label, allow_blank: false, type: String
      end
      put ':id' do
        authorize_admin!
        industry = Industry.find(params[:id])
        authorize!(:update, Industry)
        industry.update(post_params)
        success
      end

      desc "Delete industry"
      delete ':id' do
        authorize_admin!
        Industry.find(params[:id]).destroy
      end
    end
  end
end
