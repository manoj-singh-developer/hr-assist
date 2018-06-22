require 'rails_helper'

RSpec.describe V1::Training, type: :request do

  describe 'GET /api/v1/trainings' do

    before do
      create_list(:training, 2)
    end

    context 'get all trainings' do
      let(:user) { create(:user, :employee) }
      it 'should get all trainings' do
        get "/api/v1/trainings", headers: authorize(user)
        result = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(result["items"].count).to eq(2)
      end
    end

    context 'when is a valid training' do
      let(:user) { create(:user, :admin) }
      let(:training) { create(:training) }
      it 'should get the specified training' do
        id = training[:id]
        get "/api/v1/trainings/#{id}", headers: authorize(user)
        expect(response.status).to eq(200)
      end

      context 'when is an invalid training' do
        let(:user) { create(:user, :employee) }
        context 'when id is invalid' do
          it 'should get 400 error' do
            get "/api/v1/trainings/id", headers: authorize(user)
            expect(response.status).to eq(400)
          end
        end

        context "when training with id doesn't exist" do
          let(:user) { create(:user, :admin) }
          it { expect(get "/api/v1/trainings/9999", headers: authorize(user)).to eq(404) }
        end
      end
    end

    context 'when user is not authorized' do
      let(:user) { create(:user, :employee) }
      it 'should get 401 error' do
        get "/api/v1/trainings"
        expect(response.status).to eq(401)
      end
    end

    context 'when you create a new training' do
      let(:admin) { create(:user, :admin) }
      let(:params) do
        {
          organizer:     'ceva',
          subject:       'altceva',
          description:   'e profesorul hawk',
          time:          '2018-01-03T09:22:00.000Z'
        }
      end
      it 'should return created status on successful creation' do
        create_training
        expect(response.status).to eq(201)
      end

      it { expect { create_training }.to change{Training.all.count}.by 1 }
    end

    context 'when you update an existing training' do
      let(:admin) { create(:user, :admin) }
      let(:training) { create(:training) }
      let(:params) do
        {
          organizer:     'ceva_nou',
          subject:       'altceva_nou',
          description:   'descriere actualizata',
          time:          Time.now
        }
      end
      it 'should return success status(200) on successful update' do
        id = training[:id]
        put "/api/v1/trainings/#{id}", params: params, headers: authorize(admin)
        expect(response.status).to eq(200)
      end
    end

    context 'when you delete a training' do
      let(:admin) { create(:user, :admin) }
      let(:training) { create(:training) }
      it 'should return success status(200) on successful delete' do
        id = training[:id]
        delete "/api/v1/trainings/#{id}", headers: authorize(admin)
        expect(response.status).to eq(200)
        get "/api/v1/trainings/#{id}", headers: authorize(admin)
        expect(response.status).to eq(404)
      end
    end

    private

    def create_training
      post "/api/v1/trainings/new", params: params, headers: authorize(admin)
    end

    def authorize(user)
      { token: user.auth_token }
    end
  end
end
