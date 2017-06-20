class AddIdToLanguagesUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :languages_users, :id, :primary_key, first: true
  end
end
