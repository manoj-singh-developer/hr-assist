class CreateProjectIndustries < ActiveRecord::Migration[5.0]
  def change
    create_table :project_industries do |t|
      t.integer :project_id
      t.integer :industry_id

      t.timestamps
    end
  end
end
