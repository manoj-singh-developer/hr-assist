class CreateHolidayReplacements < ActiveRecord::Migration[5.0]
  def change
    create_table :holiday_replacements do |t|
      t.integer :holiday_id
      t.integer :project_id
      t.integer :replacer_id
      t.integer :replaced_user_id
      t.references :replacer
      t.references :replaced_user
      t.timestamps
    end
  end
end
