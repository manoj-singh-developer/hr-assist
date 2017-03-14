class ApplicationType < ApplicationRecord
  has_many :application_type_projects
  has_many :projects, through: :application_type_projects
end
