class CreateActivityProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :activity_projects do |t|
      t.integer :activity_id
      t.integer :project_id

      t.timestamps
    end
  end
end
