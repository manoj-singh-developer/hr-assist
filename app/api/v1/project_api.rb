# -*- encoding : utf-8 -*-
module V1
  class ProjectAPI < Grape::API
    
    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def postParams
        ActionController::Parameters.new(params)
          .permit(:name, :description,:start_date, :end_date, :deadline, :main_activities, :url, :assist_url)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end
    
    before do
      authenticate!
    end

    version 'v1', using: :path
    format :json

    resource :projects do

      desc "Return all projects"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do

        items = Project.all.page(params[:page]).per(params[:per_page])

        {
          :items => items,
          :paginate => url_paginate(items, params[:per_page])
        }
      end

      params do
        requires :id, type: Integer , desc: "Project id"
      end

      desc "Returns a project"
      get ':id' do
        project = Project.find(params[:id])
        authorize! :read, project
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
        Project.create!(postParams)
        success
      end
    end
  end
end
