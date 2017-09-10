class CreateHardwareComponents < ActiveRecord::Migration[5.0]
  def change
    create_table :hardware_components do |t|
      t.text :name

    end
  end
end
