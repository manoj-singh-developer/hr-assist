class CreateJoinTableUsersEducations < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :educations do |t|
      t.references :user, index: true, foreign_key: true
      t.references :education, index: true, foreign_key: true
      # t.index [:user_id, :education_id]
      # t.index [:education_id, :user_id]
    end
  end
end
