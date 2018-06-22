class CreateUserDepartments < ActiveRecord::Migration[5.0]
  def change
    create_table :user_departments do |t|
      t.references :user, index: true, foreign_key: true
      t.references :department, index: true, foreign_key: true

      t.timestamps
    end
  end
end
