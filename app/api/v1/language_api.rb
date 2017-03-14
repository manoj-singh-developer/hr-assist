module V1
  class LanguageAPI < Grape::API
    version 'v1' , using: :path
    format :json

    resource :languages do

      get do
        Language.all
      end

      params do
        requires :id, type: Integer, desc: "Language ID"
      end

      get ':id' do
        Language.find_by_id(params[:id]) ? Language.find_by_id(params[:id]) : {message: 'Language not found'}
      end
    end
  end
end