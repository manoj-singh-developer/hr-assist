class DropTableTechnologiesUsers < ActiveRecord::Migration[5.0]
  def change
    drop_table :technologies_users
  end
end
