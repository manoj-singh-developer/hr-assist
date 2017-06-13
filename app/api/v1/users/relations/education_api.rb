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

          before { authenticate! }

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
        end
      end
    end
  end
end
