class AddRegStatusToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :reg_status, :string
  end
end
