require 'rails_helper'

RSpec.describe V1::Users::UserAPI, type: :request do

  let(:user) { create(:user, :with_role) }

  describe "Login" do

    context 'Failed login' do

      it 'login without params' do
        post "/api/v1/login"

        expect(response).to have_http_status(400)
        expect(json['error']).to eq('email is missing, password is missing')

      end

    end
    
    it 'get user by id' do

      get "/api/v1/users/#{user.id}", headers: {"token" => user.auth_token}

      expect(response).to have_http_status(200)
      expect(json["id"]).to be_kind_of(Numeric)

    end
  end
end
