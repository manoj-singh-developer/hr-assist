class CreateEducations < ActiveRecord::Migration[5.0]
  def change
    create_table :educations do |t|
      t.string :name, limit: 120
      t.string :degree, limit: 120
      t.text :description
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
