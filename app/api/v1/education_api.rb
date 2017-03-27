module V1
  class EducationAPI < Grape::API
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
          .permit(:name, :degree, :description, :start_date, :end_date)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :educations do

      desc "Return all educations"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Education
      end

      desc "Returns an education"
      params do
        requires :id , type: Integer, desc: "Education ID"
      end
      get ':id' do
        authorize! :read, Education.find(params[:id])
      end

      desc "Create new education"
      params do
        requires :name, allow_blank: false, type: String
        requires :degree, allow_blank: false, type: String
        requires :description, allow_blank: false, type: String
        requires :start_date, allow_blank: false, type: Date
        optional :end_date, allow_blank: false, type: Date
      end
      post 'new' do
        authorizeAndCreate(Education, postParams)
      end

      desc "Update education"
      params do
        optional :name, allow_blank: false, type: String
        optional :degree, allow_blank: false, type: String
        optional :description, allow_blank: false, type: String
        optional :start_date, allow_blank: false, type: Date
        optional :end_date, allow_blank: false, type: Date
      end

      put ':id' do
        education = Education.find(params[:id])
        authorize! :update, Education
        education.update(postParams)
        success
      end

      desc "Delete education"
      delete ':id' do
        Education.find(params[:id]).destroy
      end
    end
  end
end
