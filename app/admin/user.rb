ActiveAdmin.register User do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end

  permit_params :role_ids,:first_name,:middle_name,:last_name,:address,:birthday,:phone,:picture,:observations,:email_other,:urgent_contact,:car_plate,
                  :assist_start_date,:courses_and_certifications,:courses_date,:skills_level,:skills_type,:project_dates,:status

  form do |f|
    f.inputs "Edit User" do
      f.input :first_name
      f.input :middle_name
      f.input :last_name
      f.input :address
      f.input :birthday
      f.input :phone
      f.input :picture
      f.input :observations
      f.input :email_other
      f.input :urgent_contact
      f.input :car_plate
      f.input :assist_start_date
      f.input :courses_and_certifications
      f.input :courses_date
      f.input :skills_level
      f.input :skills_type
      f.input :project_dates
      f.input :status
      f.input :role_ids, :label => "Roles (1 for admin)"
    end
    f.actions
  end


end
