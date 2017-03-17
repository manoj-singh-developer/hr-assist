class CreateJoinTableProjectsActivities < ActiveRecord::Migration[5.0]
  def change
    create_join_table :projects, :activities do |t|
      t.references :project, index: true, foreign_key: true
      t.references :activity, index: true, foreign_key: true
      # t.index [:project_id, :activity_id]
      # t.index [:activity_id, :project_id]
    end
  end
end
