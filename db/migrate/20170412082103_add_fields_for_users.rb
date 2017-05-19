class AddFieldsForUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :city, :string
    add_column :users, :zip_code, :string
    add_column :users, :office_nr, :string
    add_column :users, :urgent_contact_phone, :string
  end
end
