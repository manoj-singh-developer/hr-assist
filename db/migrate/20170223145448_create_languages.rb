class CreateLanguages < ActiveRecord::Migration[5.0]
  def change
    create_table :languages do |t|
      t.string :long_name
      t.string :short_name

      t.timestamps
    end
  end
end
