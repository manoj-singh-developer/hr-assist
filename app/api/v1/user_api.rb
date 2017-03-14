module V1
  class UserAPI < Grape::API
    version 'v1', using: :path
    format :json

    helpers do
      def nil_error field
        "This user didn't fill in #{field} field"
      end
    end

    resource :users do
      get do
        User.all
      end

      params do
        requires :id ,type: Integer , desc: "User id"
      end

      get ':id' do
        user = User.find_by_id(params[:id])
        user ? user : {message: 'User not found'}
      end

      get ':id/equipments' do
        user = User.find_by_id(params[:id])
        user.equipments.any? ? user.equipments : nil_error("equipments")
      end

      get ':id/languages' do
        user = User.find_by_id(params[:id])
        user.languages.any? ? user.languages : nil_error("languages")
      end

      get ':id/positions' do
        user = User.find_by_id(params[:id])
        user.positions.any? ? user.positions : nil_error("positions")
      end

      get ':id/educations' do
        user = User.find_by_id(params[:id])
        user.educations.any? ? user.educations : nil_error("educations")
      end

      get ':id/uploads' do
        user = User.find_by_id(params[:id])
        user.uploads.any? ? user.uploads : nil_error("uploads")
      end

      get ':id/schedules' do
        user = User.find_by_id(params[:id])
        user.schedule ? user.schedule : {message: 'Schedule not found'}
      end

    end
  end
end