class Project < ApplicationRecord
  has_many :user_projects
  has_many :holiday_replacements
  has_many :users, through: :user_projects
  has_and_belongs_to_many :customers
  has_and_belongs_to_many :industries
  has_and_belongs_to_many :activities
  has_and_belongs_to_many :technologies
  has_and_belongs_to_many :application_types

end
