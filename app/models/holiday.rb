class Holiday < ApplicationRecord
  belongs_to :user
  has_many :holiday_replacements
end
