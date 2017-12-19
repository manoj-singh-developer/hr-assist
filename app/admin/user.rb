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

  permit_params :role_ids,:first_name,:middle_name,:last_name,:address,:birthday,:phone,:picture,:observations,:other_email,:urgent_contact_name,:car_plate,
                  :company_start_date,:status, :city, :zip_code, :office_nr, :urgent_contact_phone, :company_end_date, :is_active, :reg_status

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
      f.input :other_email
      f.input :urgent_contact_name
      f.input :car_plate
      f.input :company_start_date
      f.input :status
      f.input :city
      f.input :zip_code
      f.input :office_nr
      f.input :urgent_contact_phone
      f.input :role_ids, :label => "Roles (1 for admin)"
      f.input :company_end_date
      f.input :is_active
      f.input :reg_status, as: :select, collection: ["pending","confirmed"]
    end
    f.actions
  end


end
