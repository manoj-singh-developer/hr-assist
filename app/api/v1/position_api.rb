module V1
  class PositionAPI < Grape::API
    version 'v1' , using: :path
    format :json

    resource :positions do

      get do
        Position.all
      end

      params do
        requires :id , type: Integer, desc: "Position ID"
      end

      get ':id' do
        Position.find_by_id(params[:id]) ? Position.find_by_id(params[:id]) : {message: 'Position not found'}
      end
    end
  end
end