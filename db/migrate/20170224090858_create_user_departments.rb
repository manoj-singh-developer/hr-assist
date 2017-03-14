class CreateUserDepartments < ActiveRecord::Migration[5.0]
  def change
    create_table :user_departments do |t|
      t.integer :user_id
      t.integer :department_id

      t.timestamps
    end
  end
end
