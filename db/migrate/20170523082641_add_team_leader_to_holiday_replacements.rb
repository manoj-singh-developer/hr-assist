class AddTeamLeaderToHolidayReplacements < ActiveRecord::Migration[5.0]
  def change
    add_reference :holiday_replacements, :team_leader, references: :users, index: true
    add_foreign_key :holiday_replacements, :users, column: :team_leader_id
  end
end
