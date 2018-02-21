module V1
  class ComponentAPI < Grape::API

    version 'v1' , using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params).permit(:name)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end
    end

    before do
      authenticate!
    end

    resource :components do

      desc "Get all components, roles: admin/user"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for HardwareComponent
      end

      desc "Get component, role: admin"
      params do
        requires :id, type: Integer , desc: " HardwareComponent_id"
      end
      get ':id' do
        authorize! :read, HardwareComponent.find(params[:id])
      end

      desc 'Add new component, roles: admin

      {"name": "component_name"}'
      params do
        requires :name, allow_blank: false, type: [String]
      end
      post 'new' do
        if params[:name]
          params[:name].each do |value|
            authorize_and_create(HardwareComponent, { name: value})
          end
        end
      end

      desc 'Update component, role: admin

      {"id": "1", "name": "component_name"}'
      params do
        optional :name, allow_blank: false, type: String
      end
      put ':id' do
        authorize_admin!
        hardware_component = HardwareComponent.find(params[:id])
        authorize!(:update, HardwareComponent)
        hardware_component.update(post_params)
        success
      end

      desc "Delete component, role: admin "
      delete ':id' do
        authorize_admin!
        HardwareComponent.find(params[:id]).destroy
      end
    end
  end
end
