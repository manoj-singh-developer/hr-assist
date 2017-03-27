class CreateDevices < ActiveRecord::Migration[5.0]
  def change
    create_table :devices do |t|
      t.string :name
      t.text :description
      t.integer :total

      t.timestamps
    end
  end
end
