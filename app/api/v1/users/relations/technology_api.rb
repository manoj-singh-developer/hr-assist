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
            { items: response }
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
        end
      end
    end
  end
end
