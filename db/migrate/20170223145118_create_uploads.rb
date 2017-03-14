class CreateUploads < ActiveRecord::Migration[5.0]
  def change
    create_table :uploads do |t|
      t.string :file_name, limit: 120
      t.string :file_description
      t.string :path
      t.integer :user_id

      t.timestamps
    end
  end
end
