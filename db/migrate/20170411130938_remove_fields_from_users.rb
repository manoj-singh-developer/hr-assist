class RemoveFieldsFromUsers < ActiveRecord::Migration[5.0]
  change_table :users do |t|
  t.remove :courses_and_certifications
  t.remove :courses_date
  t.remove :skills_level
  t.remove :skills_type
  t.remove :project_dates
  end
end
