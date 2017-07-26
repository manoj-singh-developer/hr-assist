class CreateCandidateTechnologies < ActiveRecord::Migration[5.0]
  def change
    create_table :candidate_technologies do |t|
      t.integer :level
      t.references :candidate, foreign_key: true
      t.references :technology, foreign_key: true

      t.timestamps
    end
  end
end
