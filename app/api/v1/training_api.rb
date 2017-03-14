module V1
  class TrainingAPI < Grape::API
    version 'v1' , using: :path
    format :json

    resource :trainings do

      get do
        Training.all
      end

      params do
        requires :id , type: Integer , desc: "Training ID"
      end

      get ':id' do
        Training.find_by_id(params[:id]) ? Training.find_by_id(params[:id]) : {message: 'Training not found'}
      end

    end

  end
end