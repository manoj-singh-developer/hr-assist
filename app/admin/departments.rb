ActiveAdmin.register Department do
	permit_params :name, :functional_manager

	form do |f|
		f.inputs "Edit Department" do
			f.input :name
			f.input :functional_manager
		end
		f.actions
	end
end