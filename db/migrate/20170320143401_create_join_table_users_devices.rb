class CreateJoinTableUsersDevices < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :devices do |t|
      t.references :user, index: true, foreign_key: true
      t.references :device, index: true, foreign_key: true
      # t.index [:user_id, :device_id]
      # t.index [:device_id, :user_id]
    end
  end
end
