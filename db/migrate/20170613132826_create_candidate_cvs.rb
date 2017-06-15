class CreateCandidateCvs < ActiveRecord::Migration[5.0]
  def change
    create_table :candidate_cvs do |t|

      t.references :candidate, index: true, foreign_key: true
      t.attachment :cv
      t.timestamps
    end
  end
end
