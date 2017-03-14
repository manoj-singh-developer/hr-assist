module V1
  class EquipmentAPI < Grape::API

    version 'v1' , using: :path
    format :json

    resource :equipments do

      get do
        Equipment.all
      end

      params do
        requires :id , type: Integer , desc: "Equipment ID"
      end

      get ':id' do
        Equipment.find_by_id(params[:id]) ? Equipment.find_by_id(params[:id]) : {message: 'Equipment not found'}
      end
    end
  end
end