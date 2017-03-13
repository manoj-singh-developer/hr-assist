module V1
  class CustomerAPI < Grape::API
    version 'v1', using: :path
    format :json

    resource :customers do

      desc "Return all curstomers"
      get do
        Customer.all
      end

      params do
        requires :id ,type: Integer , desc: "Customer id"
      end

      desc "Returns a customer"
      get ':id' do
        customer = Customer.find_by_id(params[:id])
        customer ? customer : {message: "Customer not found"}
      end

      desc "Returns customers country"
      get ':id/country' do
        Customer.find_by_id(params[:id]).country
      end
    end
  end
end
