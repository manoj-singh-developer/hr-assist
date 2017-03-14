module V1
  class ActivityAPI < Grape::API
    version 'v1', using: :path
    format :json

    resource :activities do

      desc "Return all activities"
      get do
        Activity.all
      end

      params do
        requires :id ,type: Integer , desc: "activity id"
      end

      desc "Returns an activity"
      get ':id' do
        activity = Activity.find_by_id(params[:id])
        activity ? activity : {message: "activity not found"}
      end
    end
  end
end
