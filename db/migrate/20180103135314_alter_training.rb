class AlterTraining < ActiveRecord::Migration[5.0]
  def change
  	remove_column :trainings, :title, :string 
  	remove_column :trainings, :picture, :text
  	remove_column :trainings, :start_date, :text
  	remove_column :trainings, :duration, :text
  	remove_reference :trainings, :user, index: true, foreign_key: true	

  	add_column :trainings, :organizer, :string
  	add_column :trainings, :subject, :string
  	add_column :trainings, :time, :datetime
  end
end
