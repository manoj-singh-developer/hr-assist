class CreatePositions < ActiveRecord::Migration[5.0]
  def change
    create_table :positions do |t|
      t.string :name, limit: 120
      t.text :job_detail

      t.timestamps
    end
  end
end
