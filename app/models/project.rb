class Project < ApplicationRecord
  has_many :user_projects
  has_many :users, through: :user_projects
  has_many :project_technologies
  has_many :technologies, through: :project_technologies
  has_many :customer_projects
  has_many :customers, through: :customer_projects
  has_many :project_industries
  has_many :industries, through: :project_industries
  has_many :activity_projects
  has_many :activities, through: :activity_projects
  has_many :application_type_projects
  has_many :application_types, through: :application_type_projects
  has_many :holiday_replacements

end
