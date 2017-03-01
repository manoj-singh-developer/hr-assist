class HolidayReplacement < ApplicationRecord
  belongs_to :holiday
  belongs_to :project
  belongs_to :replacer, class_name: 'User', foreign_key: 'replacer_id'
  belongs_to :replaced_user, class_name: 'User', foreign_key: 'replaced_user_id'
end
