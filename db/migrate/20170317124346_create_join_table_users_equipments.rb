class CreateJoinTableUsersEquipments < ActiveRecord::Migration[5.0]
  def change
    create_join_table :users, :equipments do |t|
      t.references :user, index: true, foreign_key: true
      t.references :equipment, index: true, foreign_key: true
      # t.index [:user_id, :equipment_id]
      # t.index [:equipment_id, :user_id]
    end
  end
end
