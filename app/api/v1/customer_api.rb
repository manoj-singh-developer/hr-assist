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

      def postParams
        ActionController::Parameters.new(params)
          .permit(:name, :country_id)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :customers do

      desc "Return all curstomers"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Customer
      end

      desc "Returns a customer"
      params do
        requires :id ,type: Integer , desc: "Customer id"
      end
      get ':id' do
        authorize! :read, Customer.find(params[:id])
      end

      get ':id/projects' do
        customer = Customer.find_by_id(params[:id])
        projects = customer.projects
        projects
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
          params[:items].each do |x|
            authorizeAndCreate(Customer, {name: x[:name] , country_id: x[:country_id]})
          end
        else
          authorizeAndCreate(Customer, postParams)
        end
      end

      desc "Update customer"
      params do
        optional :name, allow_blank: false, type: String
      end

      put ':id' do
        customer = Customer.find(params[:id])
        authorize! :update, Customer
        customer.update(postParams)
        success
      end

      desc "Delete a customer"
      delete ':id' do
        Customer.find(params[:id]).destroy
      end
    end
  end
end
