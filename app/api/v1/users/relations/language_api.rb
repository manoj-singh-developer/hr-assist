module V1
  module Users
    module Relations
      class LanguageAPI < Grape::API
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

          get ':user_id/languages' do
            user = find_user(params[:user_id])
            { items: user.user_languages }
          end

          params do
            requires :languages, allow_blank: false, type: []
          end
  
          put ':user_id/languages' do
            user = User.find(params[:user_id])

            params[:languages].each do |language|

              lang = Language.find(language['id'])
              user_language = UserLanguage.create(level: language['level'], language_id: lang.id, user_id: user.id)

            end

            { items: user.user_languages }
          end

          delete ':user_id/languages' do
            delete_object(User, Language, params[:user_id], params[:language_ids])
          end
        end
      end
    end
  end
end
