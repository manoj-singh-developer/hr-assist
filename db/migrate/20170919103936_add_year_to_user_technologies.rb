class AddYearToUserTechnologies < ActiveRecord::Migration[5.0]
  def change
    add_column :user_technologies, :year, :string
  end
end
