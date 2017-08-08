class ChangeSshColumnType < ActiveRecord::Migration[5.0]
  def change
    change_column :work_infos, :ssh_public_key, :text
  end
end
