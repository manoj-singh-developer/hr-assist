class UserProject < ApplicationRecord
  belongs_to :user
  belongs_to :project
  has_many :user_project_technologies
  has_many :project_technologies, through: :user_project_technology
end
