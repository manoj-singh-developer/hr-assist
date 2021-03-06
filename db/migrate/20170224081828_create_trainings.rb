class CreateTrainings < ActiveRecord::Migration[5.0]
  def change
    create_table :trainings do |t|
      t.string :title
      t.text :description
      t.text :picture
      t.date :start_date
      t.integer :duration
      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
