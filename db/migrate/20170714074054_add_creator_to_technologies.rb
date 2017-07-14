class AddCreatorToTechnologies < ActiveRecord::Migration[5.0]
  def change
    add_reference :technologies, :creator, references: :users, index: true, after: :id
  end
end
