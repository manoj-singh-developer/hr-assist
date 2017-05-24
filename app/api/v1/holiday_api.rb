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

      def employee_replacements(holiday_replacements)
        holiday_replacements.map do |holiday_replacement|
          partial_response = {
            project_name: holiday_replacement.project.name
          }
          partial_response.merge!({
            team_leader: holiday_replacement.team_leader.name
          }) if holiday_replacement.team_leader

          partial_response.merge!({
            replacer_id: holiday_replacement.replacer_id,
            replacer_name: holiday_replacement.replacer.name
          }) if holiday_replacement.replacer

          partial_response
        end
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
        authorize! :read, Holiday
        holidays = Holiday.all
        response = []
        holidays.each do |holiday|
          holiday_replacements = holiday.holiday_replacements
          response << {
          holiday_id: holiday.id,
          user_id: holiday.user_id,
          days: holiday.days,
          start_date: holiday.start_date,
          end_date: holiday.end_date,
          signing_day: holiday.signing_day,
          employee_replacements: employee_replacements(holiday_replacements)
        }
        end
        return response
      end

      desc "Returns a holiday"
      params do
        requires :id, type: Integer , desc: "Holiday id"
      end
      get ':id' do
        authorize! :read, Holiday
        response = []
        holiday = Holiday.find(params[:id])
        holiday_replacements = holiday.holiday_replacements
        response = {
          holiday_id: holiday.id,
          user_id: holiday.user_id,
          days: holiday.days,
          start_date: holiday.start_date,
          end_date: holiday.end_date,
          signing_day: holiday.signing_day,
          employee_replacements: employee_replacements(holiday_replacements)
        }
        return response
      end

      desc "Create new holiday"
      params do
        requires :user_id, allow_blank: false, type: Integer
        requires :start_date, allow_blank: false, type: Date
        requires :end_date, allow_blank: false, type: Date
        optional :signing_day, type: Date
        optional :days, type: Integer
        requires :project_ids, allow_blank: false, type: Array[Integer], desc: "Test using postman [Swagger UI issue]"
        optional :team_leader_ids, allow_blank: false, type: Array[Integer]
        requires :replacer_ids, allow_blank: true, type: Array[Integer], desc: "Test using postman [Swagger UI issue]"
      end
      post 'new' do
        User.find(params[:user_id], params[:replacer_id], params[:team_leader_ids])
        params[:project_ids].each do |project_id|
          project = Project.find(project_id)
        end
        holiday = authorizeAndCreate(Holiday, postParams)
        params[:project_ids].zip(params[:replacer_ids], params[:team_leader_ids]).each do |project_id, replacer_id, team_leader_id|
          holiday_replacement = HolidayReplacement.create(holiday_id: holiday.id, project_id: project_id, replacer_id:replacer_id, team_leader_id: team_leader_id)
          holiday.holiday_replacements << holiday_replacement
        end
        holiday_replacements = holiday.holiday_replacements
        response = {
          holiday_id: holiday.id,
          user_id: holiday.user_id,
          days: holiday.days,
          start_date: holiday.start_date,
          end_date: holiday.end_date,
          signing_day: holiday.signing_day,
          employee_replacements: employee_replacements(holiday_replacements)
        }
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
