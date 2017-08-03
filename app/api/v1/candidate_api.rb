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

        if params[:audio_files]
          clone_params[:audio_files].each_with_index do |audio_file, index|
            clone_params[:audio_files][index] = convert_hashie_to_file(audio_file)
          end
        end

         ActionController::Parameters.new(clone_params).permit(:name, :university_start_year, :university_end_year, :projects, :category,
                                                               :contact_info, :comments, :status, :candidate_cv, audio_files: [])
      end

      def convert_hashie_to_file file
        file = file[1] if file.class == Array
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
        getPaginatedItemsFor Candidate, ['candidate_cv', 'candidate_files', 'technologies']
      end

      desc "Returns a candidate"
      params do
        requires :id, type: Integer , desc: "Candidate id"
      end
      get ':id' do
        authorize! :read, Candidate.find(params[:id])
        getPaginatedItemsFor Candidate.where(id: params[:id]), ['candidate_cv', 'candidate_files', 'technologies']
      end

      desc "Create new candidate"
      params do
        requires :name,                   allow_blank: false, type: String
        optional :technologies,           allow_blank: false, type: Array::Hash
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
        if params[:technologies]
          params[:technologies].each do |tech|
            technology = Technology.find_or_create_by(name: tech[1][:technology_name])
            CandidateTechnology.create(level: tech[1][:technology_level], technology_id: technology.id, candidate_id: candidate.id)
          end
        end
        if candidate
          candidate.candidate_cv = CandidateCv.create!(cv: cv_file) if cv_file
          if audio_files
            audio_files.each do |audio_file|
              candidate.candidate_files << CandidateFile.create!(file: audio_file)
            end
          end

          getPaginatedItemsFor Candidate.where(id: candidate.id), ['candidate_cv', 'candidate_files', 'technologies']
        end

      end

      desc "Update candidate"
      params do
        requires :name,                   allow_blank: false, type: String
        optional :technologies,           allow_blank: false, type: Array::Hash
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

        candidate = Candidate.find(params[:id])
        if params[:technologies]
          params[:technologies].each do |technology|
            Technology.create(name: technology[1].technology_name) if technology[1][:technology_name] && Technology.where(name: technology[1][:technology_name]).empty?
            technology_id = Technology.find_by_name(technology[1][:technology_name]).id
            candidate_technology = CandidateTechnology.find_or_create_by!(candidate_id: candidate.id, technology_id: technology_id) if candidate.id
            candidate_technology.update(level: technology[1].technology_level) if technology[1][:technology_level]
          end
        end
        model_params = postParams

        cv_file = model_params.delete(:candidate_cv) if model_params[:candidate_cv]
        audio_files = model_params.delete(:audio_files) if model_params[:audio_files]

        candidate.update(model_params)

        candidate = Candidate.where(id: params[:id])
        candidate.first.candidate_cv = CandidateCv.create!(cv: cv_file) if cv_file

        if audio_files
         audio_files.each do |audio_file|
            candidate.first.candidate_files << CandidateFile.create!(file: audio_file)
          end
        end

        getPaginatedItemsFor Candidate.where(id: params[:id]), ['candidate_cv', 'candidate_files', 'technologies']
      end

      desc "Delete candidate technologies"
      params do
        requires :technology_ids, type: [Integer], desc: "Technology ids"
      end
      delete ':id/technologies' do
        delete_object(Candidate, Technology, params[:id], params[:technology_ids])
      end

      desc "Delete candidate audio files"
      params do
        requires :file_ids, type: [Integer], desc: "File ids"
      end
      delete ':id/files' do
        delete_object(Candidate, CandidateFile, params[:id], params[:file_ids])
      end

      desc "Delete candidate"
      params do
        requires :id, type: Integer , desc: "Candidate id"
      end
      delete ':id' do
        Candidate.find(params[:id]).destroy
      end
    end
  end
end
