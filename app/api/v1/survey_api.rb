module V1
  class SurveyAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

    end

    before do
      authenticate!
    end

    resource :surveys do

      desc "get all surveys"
      get do
        get_paginated_items_for(Rapidfire::Survey::Question)
      end

      desc "submit answers"
      post ':survey_id' do
        x = Rapidfire::Attempt.create(
                            survey_id: params[:survey_id],
                            user_id: current_user.id
        )
        Rapidfire::Survey::Question::Answer.create(
                                   attempt_id: x.id,
                                   question_id: params[:question_id],
                                   answer_text: params[:answer_text],
        )
      end

    end
  end
end
