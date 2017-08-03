class AddCnpToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :cnp, :string
  end
end
