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
 
          desc "Get all user holidays"
          get ':user_id/holidays' do
            user = User.find(params[:user_id])
            holidays = user.holidays
            holidays.map do |holiday|
              get_holiday(holiday)
            end
          end

          desc "Ger user holiday"
          get ':user_id/holiday/response' do
            authorize_admin!
            holiday = Holiday.where(user_id: params[:user_id]).last
            user = User.find(params[:user_id])
            {items: 
              {  
                user_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                days: holiday.days,
                start_date: holiday.start_date,
                end_date: holiday.end_date,
                holiday_id: holiday.id
              }
            }
          end

          desc "Accept user holiday"
          post ':user_id/holiday/response' do
            authorize_admin!
            choice = true ? params[:response] == "true" : false
            accepted_holiday = Holiday.where(user_id: params[:user_id]).last
            accepted_holiday.approve_holiday = choice
            accepted_holiday.save
          end

          desc "Get user holiday by id"
          get ':user_id/holidays/:holiday_id' do
            user = User.find(params[:user_id])
            holiday = user.holidays.find(params[:holiday_id])
            get_holiday(holiday)
          end

          desc "Create user holiday"
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

            user = User.find(params[:user_id])
            projects = Project.where(id: params[:project_ids])
            projects = projects.map(&:name).join(', ')
            replacements = User.where(id: params[:replacer_ids]).pluck(:first_name, :last_name).map{|t| t.join(" ")}.join(", ")
            team_leaders = User.where(id: params[:team_leader_ids]).pluck(:email)

            HolidayMailer.holiday_email(team_leaders, current_user, holiday, projects, replacements).deliver_now
              
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
