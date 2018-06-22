class HolidayMailer < ApplicationMailer

  def holiday_email(team_leaders, current_user, holiday, projects, replacements)
    @current_user = current_user
    @holiday = holiday
    @projects = projects
    @replacements = replacements
    mail(to: ['alin.cioban@assist.ro','daniel.furtuna@assist.ro'], subject: 'HR.ASSIST.RO Holiday')
  end
end
