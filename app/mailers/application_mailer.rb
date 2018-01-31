class ApplicationMailer < ActionMailer::Base
  default from: 'from@example.com'
  layout 'mailer'
  DEFAULT_EMAIL_FROM = 'smtp-hr@assist.ro'.freeze
end
