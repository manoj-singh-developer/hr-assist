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

        clone_params[:candidate_cv] = convert_hashie_to_file(params[:candidate_cv]) if(params[:candidate_cv])
        
        clone_params[:audio_files].each_with_index do |audio_file, index|
          clone_params[:audio_files][index] = convert_hashie_to_file(audio_file)
        end

        ActionController::Parameters.new(clone_params).permit(:name, :university_start_year, :university_end_year, :projects, :category,
          :contact_info, :comments, :status, :candidate_cv, audio_files: [])
      end

      def convert_hashie_to_file file
        ActionDispatch::Http::UploadedFile.new(
                tempfile: file[:tempfile],
                filename: file[:filename],
                type:     file[:type],
                headers:  file[:head],
        )
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

        relations = ['candidate_cv', 'candidate_files']

        items = Candidate.all.includes(relations).page(params[:page]).per(params[:per_page])
        {
            :items => items.as_json(include: relations),
            :paginate => url_paginate(items, params[:per_page])
        }

        getPaginatedItemsFor Candidate, ['candidate_cv', 'candidate_files']
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

        cv_file = model_params.delete(:candidate_cv) if model_params[:candidate_cv]
        audio_files = model_params.delete(:audio_files) if model_params[:audio_files]

        candidate = authorizeAndCreate(Candidate, model_params)

        if candidate
          candidate.candidate_cv = CandidateCv.create!(cv: cv_file) if cv_file
          
          audio_files.each do |audio_file|
            candidate.candidate_files << CandidateFile.create!(file: audio_file)          
          end if audio_files

        end

        relations = ['candidate_cv', 'candidate_files']

        Candidate.includes(relations).find(candidate.id).as_json(include: relations)
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
        optional :audio_files,            allow_blank: false, type: [File]
        requires :status,                 allow_blank: false, type: Integer
      end

      put ':id' do

        authorize! :update, Candidate
        
        model_params = postParams

        cv_file = model_params.delete(:candidate_cv) if model_params[:candidate_cv]
        audio_files = model_params.delete(:audio_files) if model_params[:audio_files]

        candidate = Candidate.find(params[:id])
        candidate.update(model_params)

        candidate.candidate_cv = CandidateCv.create!(cv: cv_file) if cv_file
        
        audio_files.each do |audio_file|
          candidate.candidate_files << CandidateFile.create!(file: audio_file)          
        end if audio_files


        success
      end
    end
  end
end
