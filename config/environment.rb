# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!
LDAP_SETTINGS = YAML.load_file("#{Rails.root}/config/ldap.yml")
