class UserLanguage < ApplicationRecord
    self.table_name = 'languages_users'
    belongs_to :language
end
