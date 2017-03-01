class UserProjectTechnology < ApplicationRecord
  belongs_to :user_project
  belongs_to :project_technology
end
