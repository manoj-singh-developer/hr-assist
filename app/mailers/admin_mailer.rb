class AdminMailer < ApplicationMailer
	
	default from: 'smtp@assist.ro'

	def confirm_email(user)
		@user = user
		debugger
		mail(to: SmtpSetting::where(key: "ssl").first[:value], subject: 'HR.ASSIST.RO')
	end
end
