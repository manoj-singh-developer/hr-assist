class Holiday < ApplicationRecord
  belongs_to :user
  has_many :holiday_replacements, :dependent => :destroy
end
