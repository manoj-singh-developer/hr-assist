class HolidayMailer < ApplicationMailer

  def holiday_email(team_leaders, current_user, holiday, projects, replacements)
    @current_user = current_user
    @holiday = holiday
    @projects = projects
    @replacements = replacements
    mail(to: team_leaders, subject: 'HR.ASSIST.RO')
  end
end
