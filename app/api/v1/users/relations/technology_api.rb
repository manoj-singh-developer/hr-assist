module V1
  module Users
    module Relations
      class TechnologyAPI < Grape::API
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

          desc "Get all user technologies"
          get ':user_id/technologies' do
            user = User.find(params[:user_id])
            { items:
            user.user_technologies.map do |user_technology|
              {
                id: user_technology[:technology_id],
                name: user_technology.technology[:name],
                level: user_technology[:level],
                technology_type: user_technology[:technology_type],
                technology_starting_year: user_technology[:year]
              }
            end
            }
          end

          desc "Create user technologies"
          params do
            requires :names, type: Array[String], desc: "['first_technology_name', 'second_technology_name']"
            requires :types, type: Array[Integer], desc: "[6,10]"
            requires :levels, type: Array[Integer], desc: "[0,1]"
            requires :year, type: Array[String], desc: "The year the user started using the technology"
          end
          post ':user_id/technologies' do
            user = User.find(params[:user_id])
            response = []
            params[:names].zip(params[:types], params[:levels], params[:year]) do |name, type, level, year|
              technology = Technology.find_or_create_by(name: name)
              user_technology = UserTechnology.create(level: level, technology_type: type, technology_id: technology[:id], user_id: user[:id], year: year)
              response << {
                id: user_technology[:technology_id],
                name: user_technology.technology[:name],
                level: user_technology[:level],
                technology_type: user_technology[:technology_type],
                technology_starting_year: user_technology[:year]
              }
            end
            { items: response }
          end

          desc "Update user technologies"
          params do
            requires :technologies, type: Array[Hash], desc: "{ 'technologies': [{ 'id': 1, 'name': 'tech_name', 'level': 4, 'technology_type': 0, 'year': '2015' }] }"
          end
          put ':user_id/technologies' do
            user = User.find(params[:user_id])
            params[:technologies].each do |technology|
              u_technology = user.technologies.find(technology[:id])
              u_technology.update(ActionController::Parameters.new(technology).permit(:name, :label))
              user_technology = UserTechnology.find_by_technology_id_and_user_id(technology[:id], user[:id])
              user_technology.update(ActionController::Parameters.new(technology).permit(:level, :technology_type, :year))
            end
            { items:
            user.user_technologies.map do |user_technology|
              {
                id: user_technology[:technology_id],
                name: user_technology.technology[:name],
                level: user_technology[:level],
                technology_type: user_technology[:technology_type],
                technology_starting_year: user_technology[:year]
              }
            end
            }
          end

          desc "Delete user technologies"
          params do
            requires :technology_ids, type: Array[Integer], desc: "Technology ids"
          end
          delete ':user_id/technologies' do
            User.find(params[:user_id])
            user_technologies = UserTechnology.where(technology_id: params[:technology_ids], user_id: params[:user_id])
            user_technologies.delete_all
          end
        end
      end
    end
  end
end
