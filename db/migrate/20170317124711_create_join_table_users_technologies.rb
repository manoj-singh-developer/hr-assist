class CreateJoinTableUsersTechnologies < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :technologies do |t|
      t.references :user, index: true, foreign_key: true
      t.references :technology, index: true, foreign_key: true
      # t.index [:user_id, :technology_id]
      # t.index [:technology_id, :user_id]
    end
  end
end
