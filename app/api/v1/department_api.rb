module V1
  class DepartmentAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params).permit(:name, :functional_manager)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :departments do

      desc "Get all departments, role: user/admin"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Department
      end

      desc "Get department, role: admin"
      params do
        requires :id, type: Integer , desc: "Department id"
      end
      get ':id' do
        authorize! :read, Department.find(params[:id])
      end

      desc 'Create new department, role: admin

      {"name": "department_name", "functional_manager": "functional_manager_name"}'
      params do
        requires :name, allow_blank: false, type: String
        requires :functional_manager, allow_blank: false, type: String
      end
      post 'new' do
        authorize_and_create(Department, post_params)
      end

      desc 'Update department, role: admin

      {"id": "1", name": "component_name", "functional_manager": "functional_manager"}'
      params do
        optional :name, allow_blank: false, type: String
        optional :functional_manager, allow_blank: false, type: String
      end
      put ':id' do
        department = Department.find(params[:id])
        authorize!(:update, Department)
        department.update(post_params)
        success
      end

      desc "Delete department, role: admin "
      delete ':id' do
        authorize_admin!
        Department.find(params[:id]).destroy
      end
    end
  end
end
