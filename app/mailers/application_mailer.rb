class ApplicationMailer < ActionMailer::Base
  default from: 'smtp-hr@assist.ro'
  layout 'mailer'
end
