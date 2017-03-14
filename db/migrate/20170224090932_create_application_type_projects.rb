class CreateApplicationTypeProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :application_type_projects do |t|
      t.integer :application_type_id
      t.integer :project_id

      t.timestamps
    end
  end
end
