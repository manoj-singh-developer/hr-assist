module V1
  module Users
    module Relations
      class EducationAPI < Grape::API
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

          desc "Get all user educations"
          get ':user_id/educations' do
            user = User.find(params[:user_id])
            { items: user.educations }
          end

          desc "Create user educations"
          params do
            requires :educations, type: Array[Hash], desc: "{ 'educations': [{ 'name': 'ed_name', 'description': 'ed_description', ... }] }"
          end
          post ':user_id/educations' do
            user = User.find(params[:user_id])
            params[:educations].each do |education|
              user_education = Education.create(name: education.name, degree: education.degree, description: education.description, start_date: education.start_date, end_date: education.end_date)
              user.educations << user_education
            end
            { items: user.educations }
          end

          desc "Update user educations"
          params do
            requires :educations, type: Array[Hash], desc: "{ 'educations': [{ 'id': 1, 'name': 'new_name', 'description': 'new_description', ... }] }"
          end
          put ':user_id/educations' do
            user = User.find(params[:user_id])
            params[:educations].each do |education|
              user_education = user.educations.find(education.id)
              user_education.update(ActionController::Parameters.new(education).permit(:name, :degree, :description, :start_date, :end_date))
            end

            { items: user.educations }
          end

          desc "Delete user educations"
          params do
            requires :education_ids, type: [Integer], desc: "Education ids"
          end
          delete ':user_id/educations' do
            delete_object(User, Education, params[:user_id], params[:education_ids])
          end
        end
      end
    end
  end
end
