class CreateJoinTableUsersPositions < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :positions do |t|
      t.references :user, index: true, foreign_key: true
      t.references :position, index: true, foreign_key: true
      # t.index [:user_id, :position_id]
      # t.index [:position_id, :user_id]
    end
  end
end
