class CreateJoinTableUsersLanguages < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :languages do |t|
      t.references :user, index: true, foreign_key: true
      t.references :language, index: true, foreign_key: true
      # t.index [:user_id, :language_id]
      # t.index [:language_id, :user_id]
    end
  end
end
