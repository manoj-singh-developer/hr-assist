module V1
  class ScheduleAPI < Grape::API
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
          .permit(:name, :timetable, :user_id)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :schedules do

      desc "Return all schedules"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Schedule
      end

      desc "Returns a schedule"
      params do
        requires :id, type: Integer , desc: "Schedule id"
      end
      get ':id' do
        authorize! :read, Schedule.find(params[:id])
      end

      desc "Create new schedule"
      params do
        requires :name, allow_blank: false, type: String
        requires :timetable, allow_blank: false, type: String
        requires :user_id, allow_blank: false, type: Integer
      end
      post 'new' do
        authorizeAndCreate(Schedule, postParams) do
            User.find(postParams[:user_id])
        end
      end

      desc "Update schedule"
      params do
        optional :name, allow_blank: false, type: String
        optional :timetable, allow_blank: false, type: Integer
      end

      put ':id' do
        schedule = Schedule.find(params[:id])
        authorize! :update, Schedule
        schedule.update(postParams)
        success
      end
    end
  end
end
