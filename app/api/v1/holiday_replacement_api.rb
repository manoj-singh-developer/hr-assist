module V1
  class HolidayReplacementAPI < Grape::API
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
          .permit(:holiday_id, :project_id, :replacer_id, :replaced_user_id)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :holiday_replacements do

      desc "Return all holiday replacements"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor HolidayReplacement
      end

      desc "Returns a holiday replacement"
      params do
        requires :id, type: Integer , desc: "Holiday replacement id"
      end
      get ':id' do
        authorize! :read, HolidayReplacement.find(params[:id])
      end

      desc "Create new holiday replacement"
      params do
        requires :holiday_id, allow_blank: false, type: Integer
        requires :project_id, allow_blank: false, type: Integer
        requires :replacer_id, allow_blank: false, type: Integer
        requires :replaced_user_id, allow_blank: false, type: Integer
      end
      post 'new' do
        authorizeAndCreate(HolidayReplacement, postParams) do
            Holiday.find(postParams[:holiday_id])
            Project.find(postParams[:project_id])
            User.find(postParams[:replacer_id])
            User.find(postParams[:replaced_user_id])
        end
      end

      desc "Update holiday replacement"
      params do
        optional :project_id, allow_blank: false, type: Integer
        optional :replacer_id, allow_blank: false, type: Integer
      end

      put ':id' do
        holiday_replacement = HolidayReplacement.find(params[:id])
        authorize! :update, HolidayReplacement
        holiday_replacement.update(postParams)
        success
      end
    end
  end
end
