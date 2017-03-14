module V1
  class IndustryAPI < Grape::API
    version 'v1', using: :path
    format :json

    resource :industries do

      desc "Return all industries"
      get do
        Industry.all
      end

      params do
        requires :id ,type: Integer , desc: "Industry id"
      end

      desc "Returns a industry"
      get ':id' do
        industry = Industry.find_by_id(params[:id])
        industry ? industry : {message: "Industry not found"}
      end
    end
  end
end
