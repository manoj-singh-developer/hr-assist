module V1
  module Users
    module Relations
      class ScheduleAPI < Grape::API
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

          desc "Get user schedule"
          get ':user_id/schedule' do
            user = User.find(params[:user_id])
            user.schedule
          end

          desc "Create user schedule"
          params do
            requires :name, type: String, allow_blank: false
            requires :timetable, type: String, allow_blank: false
          end
          post ':user_id/schedule' do
            user = User.find(params[:user_id])
            schedule = Schedule.create(name: params[:name], timetable: params[:timetable])
            user.schedule.destroy if user.schedule
            user.schedule = schedule
            user.schedule
          end

          desc "Update user schedule"
          params do
            optional :name, type: String
            optional :timetable, type: String
          end
          put ':user_id/schedule/:schedule_id' do
            user = User.find(params[:user_id])
            schedule = Schedule.find(params[:schedule_id])
            if user.schedule == schedule
              schedule.update(user_schedule_params)
              user.schedule
            else
              error(message: "Invalid schedule_id")
            end
          end
        end
      end
    end
  end
end
