class AdminMailer < ApplicationMailer
	
	default from:   'smtp@assist.ro'

	def confirm_email(user)
		@user = user
		mail(to:'alexandra.ursu@assist.ro', subject: 'HR.ASSIST.RO')
	end
end
