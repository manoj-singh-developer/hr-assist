class CreateUserEducations < ActiveRecord::Migration[5.0]
  def change
    create_table :user_educations do |t|
      t.integer :user_id
      t.integer :education_id

      t.timestamps
    end
  end
end
