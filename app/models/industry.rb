class Industry < ApplicationRecord
  has_many :project_industries
  has_many :projects, through: :project_industries
end
