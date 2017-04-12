class FixColumnNameToUsers < ActiveRecord::Migration[5.0]
  def change
    rename_column :users, :email_other, :other_email
    rename_column :users, :assist_start_date, :company_start_date
    rename_column :users, :urgent_contact, :urgent_contact_name
  end
end
