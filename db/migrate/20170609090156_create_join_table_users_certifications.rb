class CreateJoinTableUsersCertifications < ActiveRecord::Migration[5.0]
  def change
      create_join_table :users, :certifications do |t|
        t.references :user, index: true, foreign_key: true
        t.references :certification, index: true, foreign_key: true
      end
  end
end
