class AlterDepartments < ActiveRecord::Migration[5.0]
  def change
  	remove_column :departments, :description, :string

  	add_column :departments, :functional_manager, :string
  end
end
