require 'rails_helper'

RSpec.describe V1::Users::UserAPI, type: :request do

  let(:user) { create(:user, :with_role) }

  describe 'GET /api/v1/user/{id}' do
    
    context 'with correct credentials' do
      it 'should get user by id' do

        get "/api/v1/users/#{user.id}", headers: {'token' => user.auth_token}

        expect(response).to have_http_status(200)
        expect(json['id']).to be_kind_of(Numeric)

      end

      context 'and incorect id' do
        it 'should return 400 id is invalid' do

          get '/api/v1/users/id', headers: {'token' => user.auth_token}

          expect(response).to have_http_status(400)
          expect(json['error']).to eq('id is invalid')

        end

        it 'should return 404 not_found' do

          get '/api/v1/users/9999', headers: {'token' => user.auth_token}

          expect(response).to have_http_status(404)
          expect(json['error']).to eq('not_found')

        end
      end
    end

    context 'with incorrect credentials' do
      it 'should get user by id' do

        get "/api/v1/users/#{user.id}", headers: {'token' => "not #{user.auth_token}"}

        expect(response).to have_http_status(400)
        expect(json['error']).to eq('400 Invalid Token')

      end
    end
  end

end
