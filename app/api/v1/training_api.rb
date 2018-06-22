module V1
  class TrainingAPI < Grape::API
    version 'v1' , using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def post_params
        ActionController::Parameters.new(params)
          .permit(:organizer, :subject, :description, :time)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :trainings do

      desc "Get all trainings"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        get_paginated_items_for Training
      end

      desc "Get training \n 
      {
        'id': '6'
      }"
      params do
        requires :id, type: Integer, desc: "Training ID"
      end
      get ':id' do
        authorize_admin!
        authorize!(:read, Training.find(params[:id]))
      end

      desc "Create new training \n 
      {'description': 'ceva','organizer': 'Alex','subject': 'despre ceva ','time': '2018-01-03T09:22:00.000Z'}"
      params do
        requires :organizer, allow_blank: false, type: String
        requires :subject, allow_blank: false, type: String
        requires :description, allow_blank: false, type: String
        requires :time, allow_blank: false, type: DateTime
      end
      post 'new' do
        authorize_admin!
        authorize_and_create(Training, post_params)  
      end

      desc "Update training \n 
      {'id': '6', 'description': 'ceva','organizer': 'Alex','subject': 'despre ceva ','time': '2018-01-03T09:22:00.000Z'}"
      params do
        optional :organizer, allow_blank: false, type: String
        optional :subject, allow_blank: false, type: String
        optional :description, allow_blank: false, type: String
        optional :time, allow_blank: false, type: DateTime
      end
      put ':id' do
        authorize_admin!
        training = Training.find(params[:id])
        authorize!(:update, Training)
        training.update(post_params)
        success
      end

      desc "Delete an training \n 
      {
        'id': '6'
      }"
      delete ':id' do
        authorize_admin!
        Training.find(params[:id]).destroy
      end
    end
  end
end
