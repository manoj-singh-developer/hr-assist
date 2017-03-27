class CreateCustomers < ActiveRecord::Migration[5.0]
  def change
    create_table :customers do |t|
      t.string :name
      t.references :country, index: true, foreign_key: true

      t.timestamps
    end
  end
end
