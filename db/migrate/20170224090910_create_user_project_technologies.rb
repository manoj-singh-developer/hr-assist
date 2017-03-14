class CreateUserProjectTechnologies < ActiveRecord::Migration[5.0]
  def change
    create_table :user_project_technologies do |t|
      t.integer :user_project_id
      t.integer :technology_id

      t.timestamps
    end
  end
end
