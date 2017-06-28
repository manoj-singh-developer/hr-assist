module V1
  module Users
    module Relations
      class ProjectAPI < Grape::API
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

          desc "Get all user projects"
          get ':user_id/projects' do
            user = find_user(params[:user_id])
            { items:
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

          desc "Get all technologies for user project"
          get ':user_id/projects/:project_id/technologies' do
            User.find(params[:user_id])
            Project.find(params[:project_id])
            user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
            user_project ? {items: user_project.technologies} : []
          end

          desc "Get technology by id for user project"
          get ':user_id/projects/:project_id/technologies/:technology_id' do
            User.find(params[:user_id])
            Project.find(params[:project_id])
            Technology.find(params[:technology_id])
            user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
            user_project ? user_project.technologies.find(params[:technology_id]) : []
          end

          desc "Create user project with technologies"
          params do
            optional :start_date, type: Date
            optional :end_date, type: Date
            optional :technology_ids, type: Array[Integer], desc: "Technology ids"
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

          desc "Delete user project"
          delete ':user_id/projects/:project_id' do
            user = User.find(params[:user_id])
            user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
            user_project.destroy
          end

          desc "Delete technologies from user project"
          params do
            optional :technology_ids, type: Array[Integer], desc: "Technology ids"
          end
          delete ':user_id/projects/:project_id/technologies' do
            user = User.find(params[:user_id])
            user_project = UserProject.find_by_project_id_and_user_id(params[:project_id], params[:user_id])
            technologies = Technology.where(id: params[:technology_ids])
            user_project.technologies.delete(technologies)
          end
        end
      end
    end
  end
end
