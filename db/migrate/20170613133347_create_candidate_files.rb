class CreateCandidateFiles < ActiveRecord::Migration[5.0]
  def change
    create_table :candidate_files do |t|

      t.references :candidate, index: true, foreign_key: true
      t.attachment :file
      t.timestamps
    end
  end
end
