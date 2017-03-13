module V1
  class ApplicationTypeAPI < Grape::API
    version 'v1', using: :path
    format :json

    resource :application_types do

      desc "Return all application_types"
      get do
        ApplicationType.all
      end

      params do
        requires :id ,type: Integer , desc: "Application type id"
      end

      desc "Returns an application type"
      get ':id' do
        application_type = ApplicationType.find_by_id(params[:id])
        application_type ? application_type : {message: "Application type not found"}
      end
    end
  end
end
