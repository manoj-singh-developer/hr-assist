class CreateJoinTableProjectsApplicationTypes < ActiveRecord::Migration[5.0]
  def change
    create_join_table :projects, :application_types do |t|
      t.references :project, foreign_key: true, index: {name: "projects_to_app_types"}
      t.references :application_type, foreign_key: true, index: {name: "app_types_to_projects"}
      # t.index [:project_id, :application_type_id]
      # t.index [:application_type_id, :project_id]
    end
  end
end
