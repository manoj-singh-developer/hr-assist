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

      def postParams
        ActionController::Parameters.new(params)
          .permit(:title, :description, :picture, :start_date, :duration, :user_id)
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

      desc "Return all trainings"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Training
      end

      desc "Returns a training"
      params do
        requires :id , type: Integer , desc: "Training ID"
      end
      get ':id' do
        authorize! :read, Training.find(params[:id])
      end

      desc "Create new training"
      params do
        requires :title, allow_blank: false, type: String
        requires :description, allow_blank: false, type: String
        requires :picture, allow_blank: false, type: String
        requires :start_date, allow_blank: false, type: Date
        optional :duration, type: Integer
        optional :user_id, type: Integer
      end
      post 'new' do
        authorizeAndCreate Training, postParams do
          User.find(postParams[:user_id])
        end
      end
      
    end

  end
end