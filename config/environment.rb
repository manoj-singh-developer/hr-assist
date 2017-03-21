# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!
module YourFileReader
  def self.load
    Yaml.load_file("#{Rails.root}/config/ldap.yml")
  end
end