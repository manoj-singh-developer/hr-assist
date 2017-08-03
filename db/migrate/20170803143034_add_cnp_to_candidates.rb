class AddCnpToCandidates < ActiveRecord::Migration[5.0]
  def change
    add_column :candidates, :cnp, :string
  end
end
