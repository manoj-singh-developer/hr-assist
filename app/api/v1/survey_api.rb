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
        get_paginated_items_for(Rapidfire::Question, nil, ["default_text"])
      end

      desc "submit answers"
      params do
        requires :question_ids, type: Array[Integer]
        requires :answers, type: Array[String]
      end
      post ':survey_id' do
        @attempt = Rapidfire::Attempt.create(
                            survey_id: params[:survey_id],
                            user_id: current_user.id
        )
        Rapidfire::Survey::Question::Answer.create(
                                   attempt_id: @attempt.id,
                                   question_id: params[:question_id],
                                   answer_text: params[:answers],
        )

        score = 0
        result = []
        result << {user_id: current_user.id}
        params[:question_ids].each_with_index do |q,i|
          if Rapidfire::Question.find(q)[:default_text] == params[:answers][i]
            score += 1
          end
          partial_result = {}
          partial_result[:question_id] = q
          partial_result[:answer] = params[:answers][i]
          result << partial_result
        end
        result << {final_score: score}
        result
      end
    end
  end
end
