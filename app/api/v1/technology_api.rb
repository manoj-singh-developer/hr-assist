module V1
  class TechnologyAPI < Grape::API
    version 'v1', using: :path
    format :json

    resource :technologies do

      desc "Return all technologies"
      get do
        Technology.all
      end

      params do
        requires :id ,type: Integer , desc: "technology id"
      end

      desc "Returns a technology"
      get ':id' do
        technology = Technology.find_by_id(params[:id])
        technology ? technology : {message: "Technology not found"}
      end
    end
  end
end
