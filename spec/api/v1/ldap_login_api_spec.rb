require 'rails_helper'

RSpec.describe V1::Users::UserAPI, type: :request do

  describe "Authentication" do

    ldap_config = YAML.load_file "spec/config/ldap.yml"

    let(:user) { create(:user, :with_role) }
    let(:ldap_config) {ldap_config}

    before do

      seed_data ldap_config

      create(:role, name: "employee", description: "Employee")
      
    end

    context 'Failed' do

      it 'Authenticate without params' do
        post "/api/v1/login"

        expect(response).to have_http_status(400)
        expect(json['error']).to eq('email is missing, password is missing')

      end

      it 'Authenticate with wrong params' do

        post "/api/v1/login", params: { email: "demo@email.com", password: "password" }

        expect(response).to have_http_status(201)            
        expect(json['status']).to eq('error')
        expect(json['message']).to eq('Authentication FAILED.')

      end

    end

    context 'Success' do

      it 'Authenticate with correct credentials' do

        post "/api/v1/login", params: { email: ldap_config["ldap_user"], password: ldap_config["ldap_password"] }

        expect(response).to have_http_status(201)            
        expect(json['status']).to eq('success')

      end

    end

  end
end