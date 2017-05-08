module V1
  module Users
    class UserRelationsAPI < Grape::API
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

        before { authenticate! }

        get ':user_id/devices' do
          user = find_user(params[:user_id])
          {items: user.devices}
        end

        put ':user_id/devices' do
          user = User.find(params[:user_id])
          devices = Device.where(id: params[:device_ids]) - user.devices
          user.devices << devices if devices.count > 0
          {items: user.devices}
        end

        delete ':user_id/devices' do
          delete_object(User, Device, params[:user_id], params[:device_ids])
        end

        get ':user_id/languages' do
          user = find_user(params[:user_id])
          {items: user.languages}
        end

        put ':user_id/languages' do
          user = User.find(params[:user_id])
          languages = Language.where(id: params[:language_ids]) - user.languages
          user.languages << languages if languages.count > 0
          {items: user.languages}
        end

        delete ':user_id/languages' do
          delete_object(User, Language, params[:user_id], params[:language_ids])
        end

        get ':user_id/position' do
          user = find_user(params[:user_id])
          user.positions.last ? user.positions.last : []
        end

        params do
          requires :position_id, type: Integer
        end
        put ':user_id/position' do
          user = User.find(params[:user_id])
          position = Position.find(params[:position_id])
          user.positions.delete_all
          user.positions << position
          user.positions.last
        end

        params do
          requires :position_id, type: Integer
        end
        delete ':user_id/position' do
          user = find_user(params[:user_id])
          position = user.positions.find(params[:position_id])
          user.positions.delete_all
        end

        get ':user_id/educations' do
          user = find_user(params[:user_id])
          {items: user.educations}
        end

        params do
          requires :educations, type: Array[Hash]
        end
        post ':user_id/educations' do
          user = find_user(params[:user_id])
          params[:educations].each do |education|
            user_education = Education.create(name: education.name, degree: education.degree, description: education.description, start_date: education.start_date, end_date: education.end_date)
            user.educations << user_education
          end
          {items: user.educations}
        end

        params do
          requires :educations, type: Array[Hash]
        end
        put ':user_id/educations' do
          user = User.find(params[:user_id])
          params[:educations].each do |education|
            user_education = user.educations.find(education.id)
            user_education.update(ActionController::Parameters.new(education).permit(:name, :degree, :description, :start_date, :end_date))
          end
          {items: user.educations}
        end

        delete ':user_id/educations' do
          delete_object(User, Education, params[:user_id], params[:education_ids])
        end

        get ':user_id/schedule' do
          user = find_user(params[:user_id])
          user.schedule
        end

        params do
          optional :name, type: String
          optional :timetable, type: String
        end
        put ':user_id/schedule/:schedule_id' do
          schedule = Schedule.find_or_create_by(id: params[:schedule_id]) do |schedule|
            schedule.name = params[:name]
            schedule.timetable = params[:timetable]
          end
          schedule.update(user_schedule_params)
          user = find_user(params[:user_id])
          user.schedule = schedule
          user.schedule
        end

        get ':user_id/projects' do
          user = find_user(params[:user_id])
          {items:
            user.user_projects.map do |user_project|
              {
                project: user_project.project,
                user_project_start_date: user_project.start_date,
                user_project_end_date: user_project.end_date,
                technologies: user_project.technologies
              }
            end
          }
        end

        get ':user_id/projects/:project_id/technologies' do
          User.find(params[:user_id])
          Project.find(params[:project_id])
          user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
          user_project ? {items: user_project.technologies} : []
        end

        get ':user_id/projects/:project_id/technologies/:technology_id' do
          User.find(params[:user_id])
          Project.find(params[:project_id])
          Technology.find(params[:technology_id])
          user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
          user_project ? user_project.technologies.find(params[:technology_id]) : []
        end

        params do
          optional :start_date, type: Date
          optional :end_date, type: Date
          optional :technology_ids, type: Array[Integer]
        end

        put ':user_id/projects/:project_id' do
          user = find_user(params[:user_id])
          user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
          user_project = UserProject.create(user_id: params[:user_id], project_id: params[:project_id]) if user_project.nil?
          user_project.update(user_project_params)
          technologies = Technology.where(id: params[:technology_ids]) - user_project.technologies
          user_project.technologies << technologies if technologies.count > 0
          response = {
            start_date: user_project.start_date,
            end_date: user_project.end_date,
            technologies:
              user_project.technologies.map do |technology|
                {
                  id: technology.id,
                  name: technology.name,
                  label: technology.label
                }
              end
            }
        end

        delete ':user_id/projects/:project_id' do
          user = User.find(params[:user_id])
          user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
          user_project.destroy
        end

        params do
          optional :technology_ids, type: Array[Integer]
        end
        delete ':user_id/projects/:project_id/technologies' do
          user = User.find(params[:user_id])
          user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
          technologies = Technology.where(id: params[:technology_ids])
          user_project.technologies.delete(technologies)
        end

        get ':user_id/technologies' do
          user = find_user(params[:user_id])
          { items:
          user.user_technologies.map do |user_technology|
            {
              id: user_technology.technology_id,
              name: user_technology.technology.name,
              level: user_technology.level,
              technology_type: user_technology.technology_type
            }
          end
          }
        end

        params do
          requires :names, type: Array[String]
          requires :types, type: Array[Integer]
          requires :levels, type: Array[Integer]
        end
        post ':user_id/technologies' do
          user = User.find(params[:user_id])
          response = []
          params[:names].zip(params[:types], params[:levels]) do |name, type, level|
            technology = Technology.find_or_create_by(name: name)
            user_technology = UserTechnology.create(level: level, technology_type: type, technology_id: technology.id, user_id: user.id)
            response << {
              id: user_technology.technology_id,
              name: user_technology.technology.name,
              level: user_technology.level,
              technology_type: user_technology.technology_type
            }
          end
          {items: response}
        end

        params do
          requires :technologies, type: Array[Hash]
        end
        put ':user_id/technologies' do
          user = User.find(params[:user_id])
          params[:technologies].each do |technology|
            u_technology = user.technologies.find(technology.id)
            u_technology.update(ActionController::Parameters.new(technology).permit(:name, :label))
            user_technology = UserTechnology.find_by_technology_id_and_user_id(technology.id, user.id)
            user_technology.update(ActionController::Parameters.new(technology).permit(:level, :technology_type))
          end
          { items:
          user.user_technologies.map do |user_technology|
            {
              id: user_technology.technology_id,
              name: user_technology.technology.name,
              level: user_technology.level,
              technology_type: user_technology.technology_type
            }
          end
          }
        end

        params do
          requires :technology_ids, type: Array[Integer]
        end
        delete ':user_id/technologies' do
          user = find_user(params[:user_id])
          user_technologies = UserTechnology.where(technology_id: params[:technology_ids], user_id: params[:user_id])
          user_technologies.each do |user_technology|
            user_technology.delete
          end
        end

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
          requires :replacer_ids, allow_blank: false, type: Array[Integer]
        end
        post ':user_id/holidays' do
          user = find_user(params[:user_id])
          holiday = Holiday.create(days: params[:days], start_date: params[:start_date], end_date: params[:end_date], signing_day: params[:signing_day], user_id: params[:user_id])
          params[:project_ids].zip(params[:replacer_ids]).each do |project_id, replacer_id|
            holiday_replacement = HolidayReplacement.create(holiday_id: holiday.id, project_id: project_id, replacer_id:replacer_id)
            holiday.holiday_replacements << holiday_replacement
          end
          get_holiday(holiday)
        end

        get ':user_id/uploads' do
          user = find_user(params[:user_id])
          {items: user.uploads}
        end

        put ':user_id/uploads' do
          user = User.find(params[:user_id])
          uploads = Upload.where(id: params[:upload_ids]) - user.uploads
          user.uploads << uploads if uploads.count > 0
          {items: user.uploads}
        end

        delete ':user_id/uploads' do
          delete_object(User, Upload, params[:user_id], params[:upload_ids])
        end
      end
    end
  end
end

