class CreateJoinTableProjectsUsersTech < ActiveRecord::Migration[5.0]
  def change
    create_join_table :user_projects, :technologies do |t|
      t.references :user_projects, index: true, foreign_key: true
      t.references :technology, index: true, foreign_key: true
      # t.index [:projects_user_id, :technology_id]
      # t.index [:technology_id, :projects_user_id]
    end
  end
end
