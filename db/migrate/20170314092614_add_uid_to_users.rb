class AddUidToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :uid, :integer , :unique => true
  end
end
