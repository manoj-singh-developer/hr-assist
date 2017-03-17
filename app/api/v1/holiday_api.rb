module V1
  class HolidayAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def postParams
        ActionController::Parameters.new(params)
          .permit(:user_id, :days, :start_date, :end_date, :signing_day)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end
    
    before do
      authenticate!
    end

    resource :holidays do

      desc "Return all holidays"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Holiday
      end

      desc "Returns a holiday"
      params do
        requires :id, type: Integer , desc: "Holiday id"
      end
      get ':id' do
        authorize! :read, Holiday.find(params[:id])
      end

      desc "Create new holiday"
      params do
        requires :user_id, allow_blank: false, type: Integer
        requires :days, allow_blank: false, type: Integer
        requires :start_date, allow_blank: false, type: Date
        requires :end_date, allow_blank: false, type: Date
        optional :signing_day, allow_blank: false, type: Date
      end
      post 'new' do
        authorizeAndCreate Holiday postParams do
            User.find(postParams[:user_id])
        end
      end

    end
  end
end
