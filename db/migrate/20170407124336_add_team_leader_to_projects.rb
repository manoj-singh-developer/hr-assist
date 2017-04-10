class AddTeamLeaderToProjects < ActiveRecord::Migration[5.0]
  def change
    add_reference :projects, :team_leader, references: :users, index: true
    add_foreign_key :projects, :users, column: :team_leader_id
  end
end
