module V1
  class CandidateAPI < Grape::API
    version 'v1', using: :path
    format :json

    include RescuesAPI

    helpers do
      include AccessGranted::Rails::ControllerMethods
      include Authentication
      include Responses
      include APIHelpers

      def postParams

        clone_params = params.dup

        if(params[:candidate_cv])
          puts params[:candidate_cv].inspect
          upload = ActionDispatch::Http::UploadedFile.new(
              tempfile: params[:candidate_cv][:tempfile],
              filename: params[:candidate_cv][:filename],
              type:     params[:candidate_cv][:type],
              headers:  params[:candidate_cv][:head],
            )

          clone_params[:candidate_cv] = upload
        end

        ActionController::Parameters.new(clone_params).permit(:name, :university_start_year, :university_end_year, :projects, :category,
          :contact_info, :comments, :status, :candidate_cv)
      end

      params :pagination do
        optional :page, type: Integer
        optional :per_page, type: Integer
      end

    end

    before do
      authenticate!
    end

    resource :candidates do

      desc "Return all candidates"
      params do
        use :pagination # aliases: includes, use_scope
      end
      get do
        getPaginatedItemsFor Candidate
      end

      desc "Returns a candidate"
      params do
        requires :id, type: Integer , desc: "Candidate id"
      end
      get ':id' do
        authorize! :read, Candidate.find(params[:id])
      end

      desc "Create new candidate"
      params do
        requires :name,                   allow_blank: false, type: String
        optional :university_start_year,  allow_blank: false, type: Date
        optional :university_end_year,    allow_blank: false, type: Date
        optional :projects,               allow_blank: false, type: String
        optional :category,               allow_blank: false, type: Integer
        optional :contact_info,           allow_blank: false, type: String
        optional :candidate_cv,                               type: File
        optional :comments,               allow_blank: false, type: String
        optional :audio_files,                                type: [File]
        requires :status,                 allow_blank: false, type: Integer

      end
      post 'new' do

        model_params = postParams

        if model_params[:candidate_cv]
          cv_file = model_params[:candidate_cv]
          model_params.delete :candidate_cv
        end        

        candidate = authorizeAndCreate(Candidate, model_params)

        candidate.candidate_cv = CandidateCv.create!(cv: cv_file) if candidate && cv_file
      end

      desc "Update candidate"
      params do
        requires :name,                   allow_blank: false, type: String
        optional :university_start_year,  allow_blank: false, type: Date
        optional :university_end_year,    allow_blank: false, type: Date
        optional :projects,               allow_blank: false, type: String
        optional :category,               allow_blank: false, type: Integer
        optional :contact_info,           allow_blank: false, type: String
        optional :candidate_cv,                               type: File
        optional :comments,               allow_blank: false, type: String
        optional :audio_files,            allow_blank: false, type: File
        requires :status,                 allow_blank: false, type: Integer
      end

      put ':id' do
        candidate = Candidate.find(params[:id])
        authorize! :update, Candidate
        candidate.update(postParams)
        success
      end
    end
  end
end
