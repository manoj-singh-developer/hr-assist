module RescuesAPI
  extend ActiveSupport::Concern

  @@not_found     = :not_found
  @@access_denied = :access_denied

  included do
    rescue_from AccessGranted::AccessDenied do |exception|
        error_response(message: @@access_denied, status: 406)
    end

    rescue_from ActiveRecord::RecordNotFound do |exception|
      error_response(message: @@not_found, status: 404)
    end
  end
end