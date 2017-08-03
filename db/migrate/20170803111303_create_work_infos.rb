class CreateWorkInfos < ActiveRecord::Migration[5.0]
  def change
    create_table :work_infos do |t|
      t.string :ssh_public_key
      t.string :bitbucket
      t.string :github
      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
