class CreateUserTechnologies < ActiveRecord::Migration[5.0]
  def change
    create_table :user_technologies do |t|
      t.integer :level
      t.integer :technology_type
      t.references :user, foreign_key: true
      t.references :technology, foreign_key: true

      t.timestamps
    end
  end
end
