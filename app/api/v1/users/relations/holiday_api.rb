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
            authorize_user!
          }

          desc "Get all user holidays, role: user"
          get ':user_id/holidays' do
            user = User.find(params[:user_id])
            holidays = user.holidays
            holidays.map do |holiday|
              get_holiday(holiday)
            end
          end

          desc "Get user holiday by id"
          get ':user_id/holidays/:holiday_id' do
            user = User.find(params[:user_id])
            holiday = user.holidays.find(params[:holiday_id])
            get_holiday(holiday)
          end

          desc 'Create user holiday, role: user

          { "days": 10, "start_date": "2018-11-26", "end_date": "2018-11-29", "signing_day": "2018-11-22", "project_ids":[ "2" , "16" ], replacer_ids": ["2", "1"], "team_leader_ids": "42" }'
          params do
            requires :days, allow_blank: false, type: Integer
            requires :start_date, allow_blank: :false, type: Date
            requires :end_date, allow_blank: :false, type: Date
            requires :signing_day, allow_blank: :false, type: Date
            requires :project_ids, allow_blank: false, type: Array[Integer], desc: "Project ids"
            requires :replacer_ids, allow_blank: true, type: Array[Integer], desc: "Replacer ids (users)"
            optional :team_leader_ids, type: Array[Integer], desc: "Team leader ids (users)"
          end
          post ':user_id/holidays' do
            User.find(params[:replacer_ids], params[:team_leader_ids], params[:user_id])

            holiday = Holiday.create(days: params[:days], start_date: params[:start_date], end_date: params[:end_date], signing_day: params[:signing_day], user_id: params[:user_id])
            params[:project_ids].zip(params[:replacer_ids], params[:team_leader_ids]).each do |project_id, replacer_id, team_leader_id|
              holiday_replacement = HolidayReplacement.create(holiday_id: holiday.id, project_id: project_id, replacer_id: replacer_id, team_leader_id: team_leader_id)
              holiday.holiday_replacements << holiday_replacement
            end
            get_holiday(holiday)
          end

          desc "Delete holidays from user"
          params do
            requires :holiday_ids, type: Array[Integer], allow_blank: false, desc: "Holiday ids"
          end
          delete ':user_id/holidays' do
            delete_object(User, Holiday, params[:user_id], params[:holiday_ids])
          end
        end
      end
    end
  end
end
