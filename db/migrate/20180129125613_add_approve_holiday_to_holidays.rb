class AddApproveHolidayToHolidays < ActiveRecord::Migration[5.0]
  def change
    add_column :holidays, :approve_holiday, :boolean
  end
end
