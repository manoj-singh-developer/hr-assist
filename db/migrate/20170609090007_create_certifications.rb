class CreateCertifications < ActiveRecord::Migration[5.0]
  def change
    create_table :certifications do |t|
      t.string :name, limit: 120
      t.string :authority, limit: 120
      t.integer :licence_number
      t.date :year

      t.timestamps
    end
  end
end
