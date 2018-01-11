require 'rails_helper'

RSpec.describe V1::HardwareComponent, type: :request do

  describe 'GET /api/v1/components' do

    before do
      create_list(:hardware_component, 2)
    end

		context "get all components"do
			let(:user) {create(:user, :employee)}
			it 'should get all components' do
				get "/api/v1/components", headers: authorize(user)
				result = JSON.parse(response.body)
				debugger
        expect(response.status).to eq(200)
        expect(result["items"].count).to eq(2)
			end
		end

		context 'when you create a new component' do
      let(:admin) { create(:user, :admin) }
      let(:params) do
        {
          name: 'ceva'
        }
      end
      it 'should return created status on successful creation' do
        create_component
        expect(response.status).to eq(201)
      end

      it { expect { create_component }.to change{HardwareComponent.all.count}.by 1 }
    end

		private

    def create_component
      post "/api/v1/components/new", params: params, headers: authorize(admin)
    end

    def authorize(user)
      { token: user.auth_token }
    end
	end	
end