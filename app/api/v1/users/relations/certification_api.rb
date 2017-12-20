module V1
  module Users
    module Relations
      class CertificationAPI < Grape::API
        version 'v1', using: :path
        format :json

        include RescuesAPI

        helpers do
          include Responses
          include APIHelpers
          include Authentication
          include AccessGranted::Rails::ControllerMethods

          def certification_params(certification)
            ActionController::Parameters.new(certification)
              .permit(:name, :authority, :licence_number, :year)
          end
        end

        resource :users do

          before {
            authenticate!
            authorize_user!
          }

          desc 'Get certifications'
          get ':user_id/certifications' do
            user = User.find(params[:user_id])
            { items: user.certifications }
          end

          desc 'Create new certifications'
          params do
            requires :certifications, type: Array[Hash], desc: 'Array of certifications objects'
          end
          post ':user_id/certifications' do
            user = User.find(params[:user_id])
            params[:certifications].each do |certification|
              user_certification = Certification.create(
                name:           certification[:name],
                authority:      certification[:authority],
                licence_number: certification[:licence_number],
                year:           certification[:year]
              )
              user.certifications << user_certification
            end

            { items: user.certifications }
          end

          desc 'Update new certifications'
          params do
            requires :certifications, type: Array[Hash], desc: 'Array of certifications objects'
          end
          put ':user_id/certifications' do
            user = User.find(params[:user_id])

            params[:certifications].each do |certification|
              user_certification = user.certifications.find(certification.id)
              user_certification.update(certification_params(certification))
            end
            { items: user.certifications }
          end

          desc 'Delete certifications from a user based on ids'
          delete ':user_id/certifications' do
            delete_object(User, Certification, params[:user_id], params[:certification_ids])
          end
        end
      end
    end
  end
end
