class CreateJoinTableProjectsCustomers < ActiveRecord::Migration[5.0]
  def change
    create_join_table :projects, :customers do |t|
      t.references :project, index: true, foreign_key: true
      t.references :customer, index: true, foreign_key: true
      # t.index [:project_id, :customer_id]
      # t.index [:customer_id, :project_id]
    end
  end
end
