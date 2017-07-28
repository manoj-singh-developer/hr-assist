class Technology < ApplicationRecord
  has_and_belongs_to_many :projects
  has_and_belongs_to_many :user_projects
  has_many :user_technologies
  has_many :users, through: :user_technologies
  has_many :candidate_technologies
  has_many :candidates, through: :candidate_technologies
end
