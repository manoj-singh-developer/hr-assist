class CreateJoinTableUsersRoles < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :roles do |t|
      t.references :user, index: true, foreign_key: true
      t.references :role, index: true, foreign_key: true
      # t.index [:user_id, :role_id]
      # t.index [:role_id, :user_id]
    end
  end
end
