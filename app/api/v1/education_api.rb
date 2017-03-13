module V1
  class EducationAPI < Grape::API
    version 'v1' , using: :path
    format :json

    resource :educations do

      get do
        Education.all
      end

      params do
        requires :id , type: Integer, desc: "Education ID"
      end

      get ':id' do
        Education.find_by_id(params[:id]) ? Education.find_by_id(params[:id]) : {message: 'Position not found'}
      end
    end
  end
end