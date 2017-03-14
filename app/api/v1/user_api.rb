module V1
    class UserAPI < Grape::API
      version 'v1', using: :path
      format :json

      resource :users do

        get do
          User.all
        end

        params do
          requires :id ,type: Integer , desc: "User id"
        end

        get ':id' do
          User.find_by_id(params[:id]) ? User.find_by_id(params[:id]) : {message: 'User not found'}
        end
      end
    end
end