class CreateEquipment < ActiveRecord::Migration[5.0]
  def change
    create_table :equipment do |t|
      t.string :name
      t.string :description
      t.integer :total

      t.timestamps
    end
  end
end
