class Customer < ApplicationRecord
  has_many :customer_projects
  has_many :projects, through: :customer_projects
  belongs_to :country
end
