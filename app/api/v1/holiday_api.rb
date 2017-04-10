module V1
  class HolidayAPI < Grape::API
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
          .permit(:user_id, :days, :start_date, :end_date, :signing_day)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :holidays do

      desc "Return all holidays"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        response = []
        holidays = HolidayReplacement.all
        holidays.each do |holiday_replacement|
          response << {
            user_id: holiday_replacement.holiday.user_id,
            team_leader: holiday_replacement.project.team_leader.name,
            days: holiday_replacement.holiday.days,
            start_date: holiday_replacement.holiday.start_date,
            end_date: holiday_replacement.holiday.end_date,
            employee_replacement: [holiday_replacement.replacer_id, holiday_replacement.replacer.name, holiday_replacement.project.name],
            signing_day: holiday_replacement.holiday.signing_day
          }
        end
        return response
      end

      desc "Returns a holiday"
      params do
        requires :id, type: Integer , desc: "Holiday id"
      end
      get ':id' do
        authorize! :read, HolidayReplacement
        holiday_replacement = HolidayReplacement.find(params[:id])
        response = {
          user_id: holiday_replacement.holiday.user_id,
          team_leader: holiday_replacement.project.team_leader.name,
          days: holiday_replacement.holiday.days,
          start_date: holiday_replacement.holiday.start_date,
          end_date: holiday_replacement.holiday.end_date,
          employee_replacement: [holiday_replacement.replacer_id, holiday_replacement.replacer.name, holiday_replacement.project.name],
          signing_day: holiday_replacement.holiday.signing_day
        }
      end

      desc "Create new holiday"
      params do
        requires :user_id, allow_blank: false, type: Integer
        requires :team_leader, allow_blank: false, type: Integer
        requires :project_id, allow_blank: false, type: Integer
        requires :replacer_id, allow_blank: false, type: Integer
        requires :start_date, allow_blank: false, type: Date
        requires :end_date, allow_blank: false, type: Date
      end
      post 'new' do
        project = Project.find_by_id_and_team_leader_id(params[:project_id], params[:team_leader])
        if project
          holiday = authorizeAndCreate(Holiday, postParams)
          holiday_replacement = HolidayReplacement.create(holiday_id: holiday.id, project_id: params[:project_id], replacer_id: params[:replacer_id])
          {
            user_id: holiday.user_id,
            team_leader: holiday_replacement.project.team_leader.name,
            start_date: holiday.start_date,
            end_date: holiday.end_date,
            employee_replacement: [holiday_replacement.replacer_id, holiday_replacement.replacer.name, holiday_replacement.project.name]
          }
        else
          {message: "Project or team leader not found"}
        end
      end

      desc "Update holiday"
      params do
        optional :days, allow_blank: false, type: Integer
        optional :start_date, allow_blank: false, type: Date
        optional :end_date, allow_blank: false, type: Date
        optional :signing_day, allow_blank: false, type: Date
      end

      put ':id' do
        holiday = Holiday.find(params[:id])
        authorize! :update, Holiday
        holiday.update(postParams)
        success
      end
    end
  end
end
