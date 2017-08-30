class CreateUserDeviceSpecifications < ActiveRecord::Migration[5.0]
  def change
    create_table :user_device_specifications do |t|
      t.references :device, index: true, foreign_key: true
      t.references :hardware_component, index: true, foreign_key: true

      t.timestamps
    end
  end
end
