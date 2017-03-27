require 'yaml'

yaml_data = YAML::load_file(File.join(Rails.root, 'config', 'application.yml'))[Rails.env]
APP_CONFIG = HashWithIndifferentAccess.new(yaml_data)