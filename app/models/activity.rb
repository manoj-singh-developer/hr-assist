class Activity < ApplicationRecord
  has_many :projects, through: :activity_projects
end
