class CreateCandidates < ActiveRecord::Migration[5.0]
  def change
    create_table :candidates do |t|

      t.string  :name
      t.date    :university_start_year
      t.date    :university_end_year
      t.string  :projects
      t.integer :category
      t.string  :contact_info
      t.text    :comments
      t.integer :status

      t.timestamps
    end
  end
end
