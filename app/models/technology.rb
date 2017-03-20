class Technology < ApplicationRecord
  has_and_belongs_to_many :users
  has_and_belongs_to_many :projects
  has_and_belongs_to_many :user_projects
end
