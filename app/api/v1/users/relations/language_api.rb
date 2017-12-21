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

          desc "Get all user languages"
          get ':user_id/languages' do
            user = User.find(params[:user_id])

            user_languages = user.user_languages.map do |user_language|
              {
                language_id: user_language[:language_id],
                long_name: user_language.language[:long_name],
                short_name: user_language.language[:short_name],
                level: user_language[:level]
              }
            end
            { items: user_languages }
          end

          desc "Add language to user"
          params do
            requires :languages, allow_blank: false, type: [Hash], desc: "{ 'languages' : [{'id' : 1, 'level' : 5}] }"
          end
          put ':user_id/languages' do
            user = User.find(params[:user_id])

            params[:languages].each do |language|
              lang = Language.find(language[:id])
              user_language = UserLanguage.find_or_create_by(language_id: lang[:id], user_id: user[:id])
              user_language.level = language[:level]
              user_language.save!
            end

            { items: user.user_languages }
          end

          desc "Delete languages from user"
          params do
            requires :language_ids, type: [Integer], desc: "Language ids"
          end
          delete ':user_id/languages' do
            user = User.find(params[:user_id])
            languages = UserLanguage.where(language_id: params[:language_ids], user_id: params[:user_id])
            user.user_languages.destroy(languages) if languages
          end
        end
      end
    end
  end
end
