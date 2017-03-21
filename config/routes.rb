Rails.application.routes.draw do

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users
  mount V1::UserAPI => '/api'
  mount V1::ProjectAPI => '/api'
  mount V1::CustomerAPI => '/api'
  mount V1::TechnologyAPI => '/api'
  mount V1::IndustryAPI => '/api'
  mount V1::ActivityAPI => '/api'
  mount V1::ApplicationTypeAPI => '/api'
  mount V1::TrainingAPI => '/api'
  mount V1::EquipmentAPI => '/api'
  mount V1::LanguageAPI => '/api'
  mount V1::PositionAPI => '/api'
  mount V1::EducationAPI => '/api'


  get '/show' , to: 'admin/authenticate#show'
  post '/show' , to: 'app_settings#create'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
