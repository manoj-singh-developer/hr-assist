class CreateSmtpSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :smtp_settings do |t|
      t.string :key
      t.text :value

      t.timestamps
    end
  end
end
