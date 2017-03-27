class CreateHolidayReplacements < ActiveRecord::Migration[5.0]
  def change
    create_table :holiday_replacements do |t|
      t.references :holiday, index: true, foreign_key: true
      t.references :project, index: true, foreign_key: true
      t.integer :replacer_id, references: :user
      t.integer :replaced_user_id, references: :user
      # t.references :replacer, index: true, foreign_key: true
      # t.references :replaced_user, index: true, foreign_key: true
      t.timestamps
    end
  end
end
