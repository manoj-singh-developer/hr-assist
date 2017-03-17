class CreateHolidays < ActiveRecord::Migration[5.0]
  def change
    create_table :holidays do |t|
      t.integer :days
      t.date :start_date
      t.date :end_date
      t.date :signing_day
      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
