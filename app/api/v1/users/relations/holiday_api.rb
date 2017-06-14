module V1
  module Users
    module Relations
      class HolidayAPI < Grape::API
        version 'v1', using: :path
        format :json

        include RescuesAPI

        helpers do
          include Responses
          include APIHelpers
          include Authentication
          include AccessGranted::Rails::ControllerMethods
        end

        resource :users do

          before {
            authenticate!
            authorize_user!(find_user(params[:user_id]))
          }

          get ':user_id/holidays' do
            user = find_user(params[:user_id])
            holidays = user.holidays
            holidays.map do |holiday|
              get_holiday(holiday)
            end
          end

          get ':user_id/holidays/:holiday_id' do
            user = find_user(params[:user_id])
            holiday = user.holidays.find(params[:holiday_id])
            get_holiday(holiday)
          end

          params do
            requires :days, allow_blank: false, type: Integer
            requires :start_date, allow_blank: :false, type: Date
            requires :end_date, allow_blank: :false, type: Date
            requires :signing_day, allow_blank: :false, type: Date
            requires :project_ids, allow_blank: false, type: Array[Integer]
            requires :replacer_ids, allow_blank: true, type: Array[Integer]
            optional :team_leader_ids, type: Array[Integer]
          end
          post ':user_id/holidays' do
            User.find(params[:replacer_ids], params[:team_leader_ids])
            user = find_user(params[:user_id])

            holiday = Holiday.create(days: params[:days], start_date: params[:start_date], end_date: params[:end_date], signing_day: params[:signing_day], user_id: params[:user_id])
            params[:project_ids].zip(params[:replacer_ids], params[:team_leader_ids]).each do |project_id, replacer_id, team_leader_id|
              holiday_replacement = HolidayReplacement.create(holiday_id: holiday.id, project_id: project_id, replacer_id: replacer_id, team_leader_id: team_leader_id)
              holiday.holiday_replacements << holiday_replacement
            end
            get_holiday(holiday)
          end
        end
      end
    end
  end
end
