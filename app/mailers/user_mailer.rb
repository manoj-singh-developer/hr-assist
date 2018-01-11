class UserMailer < ApplicationMailer
	
	default from:     'smtp@assist.ro'
	
	def welcome_email(user)
		mail(to:user.email, subject: 'HR.ASSIST.RO register')
	end
end
