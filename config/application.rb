require_relative 'boot'

require 'rails/all'
require 'rack/cors'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module HR
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.paths.add File.join('app', 'api'), glob: File.join('**', '*.rb')
    config.autoload_paths += Dir[Rails.root.join('app', 'api', '*')]
    config.autoload_paths += %W(#{config.root}/app/policies #{config.root}/app/roles)
    
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins APP_CONFIG[:CORS_DOMAINS]
        resource '*',
          headers: :any,
          methods: %i(get post put patch delete options head)
      end
    end
  end
end
