class CreateJoinTableProjectsIndustries < ActiveRecord::Migration[5.0]
  def change
    create_join_table :projects, :industries do |t|
      t.references :project, index: true, foreign_key: true
      t.references :industry, index: true, foreign_key: true
      # t.index [:project_id, :industry_id]
      # t.index [:industry_id, :project_id]
    end
  end
end
