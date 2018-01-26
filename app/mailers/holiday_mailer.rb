class HolidayMailer < ApplicationMailer

	default from: 'smtp-hr@assist.ro'

	def holiday_email(user, current_user, holiday, project, replacement)
		@current_user = current_user
		@holiday = holiday
		@project = project
		@replacement = replacement
		mail(to:user.first.email, subject: 'HR.ASSIST.RO')
	end
end
