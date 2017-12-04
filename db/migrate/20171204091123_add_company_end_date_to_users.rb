class AddCompanyEndDateToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :company_end_date, :date
  end
end
