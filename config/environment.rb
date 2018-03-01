# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!
module YourFileReader
  def self.load
    YAML.load_file("#{Rails.root}/config/ldap.yml")
  end
end

Rails.application.config.expiration_token_time = 1.day

Rails.application.configure do
  config.action_mailer.default_url_options = {:host => "localhost:3000"}
  config.action_mailer.raise_delivery_errors = true
  config.active_record.migration_error = :page_load
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.perform_deliveries = true
  config.action_mailer.smtp_settings = {
    port:                  SmtpSetting::where(key: "port").first[:value].to_i,
    address:               SmtpSetting::where(key: "address").first[:value],
    user_name:             SmtpSetting::where(key: "user_name").first[:value],
    password:              ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base).decrypt_and_verify(SmtpSetting::where(key: "password").first[:value])
}
end
