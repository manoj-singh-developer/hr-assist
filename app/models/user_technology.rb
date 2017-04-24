class UserTechnology < ApplicationRecord
  belongs_to :user
  belongs_to :technology

  enum technology_type: [:main, :secondary]
end
