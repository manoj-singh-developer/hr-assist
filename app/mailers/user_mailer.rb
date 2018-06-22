class UserMailer < ApplicationMailer

	def welcome_email(user)
		mail(to:user.email, subject: 'HR.ASSIST.RO register')
	end
end