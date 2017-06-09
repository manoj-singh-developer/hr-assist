class AddLevelToLanguagesUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :languages_users, :level, :integer
  end
end
