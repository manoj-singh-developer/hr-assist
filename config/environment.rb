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