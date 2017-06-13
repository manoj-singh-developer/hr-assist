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

          before { authenticate! }

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
        end
      end
    end
  end
end
