class CreateJoinTableUsersDepartments < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :departments do |t|
      t.references :user, index: true, foreign_key: true
      t.references :department, index: true, foreign_key: true
      # t.index [:user_id, :department_id]
      # t.index [:department_id, :user_id]
    end
  end
end
