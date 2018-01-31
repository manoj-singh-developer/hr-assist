class HolidayMailer < ApplicationMailer

  default from: DEFAULT_EMAIL_FROM

  def holiday_email(team_leaders, current_user, holiday, projects, replacements)
    @current_user = current_user
    debugger
    @holiday = holiday
    @projects = projects
    @replacements = replacements
    mail(to: team_leaders, subject: 'HR.ASSIST.RO')
  end
end
