class AlterDevices < ActiveRecord::Migration[5.0]
  def change
    remove_column :devices, :description
    remove_column :devices, :total
    add_reference :devices, :user, foreign_key: true
  end
end
