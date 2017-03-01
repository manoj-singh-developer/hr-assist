class CreateProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.text :description
      t.date :start_date
      t.date :end_date
      t.date :deadline
      t.boolean :in_progress
      t.text :main_activities
      t.string :url, limit: 120
      t.string :assist_url, limit: 120
      t.timestamps
    end
  end
end
