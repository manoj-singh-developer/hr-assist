module V1
  class CustomerAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params).permit(:name, :country_id)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authorize_admin!
    end

    resource :customers do

      desc "Get all curstomers"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Customer
      end

      desc "Get customer"
      params do
        requires :id ,type: Integer , desc: "Customer id"
      end
      get ':id' do
        authorize!(:read, Customer.find(params[:id]))
      end

      desc "Get all customer projects"
      get ':id/projects' do
        customer = Customer.find(params[:id])
        projects = customer.projects
        {items: projects}
      end

      desc "Delete customer projects"
      params do
        requires :project_ids, type: [Integer], desc: "Project ids"
      end
      delete ':id/projects' do
        delete_object(Customer, Project, params[:id], params[:project_ids])
      end

      desc "Create new customer"
      params do
        requires :name, allow_blank: false, type: String
        requires :country_id, allow_blank: false, type: Integer
      end
      post 'new' do
        if params[:items]
          params[:items].each do |item|
            authorize_and_create(Customer, {name: item[:name] , country_id: item[:country_id]})
          end
        else
          authorize_and_create(Customer, post_params)
        end
      end

      desc "Update customer"
      params do
        optional :name, allow_blank: false, type: String
      end
      put ':id' do
        customer = Customer.find(params[:id])
        authorize!(:update, Customer)
        customer.update(post_params)
        success
      end

      desc "Delete a customer"
      delete ':id' do
        Customer.find(params[:id]).destroy
      end
    end
  end
end
