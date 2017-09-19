class DropTableDevicesUsers < ActiveRecord::Migration[5.0]
  def change
    drop_table :devices_users
  end
end
