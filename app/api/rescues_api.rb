module RescuesAPI
  extend ActiveSupport::Concern

  @@not_found     = :not_found
  @@access_denied = :access_denied
  @@sql_error     = :sql_error

  included do
    rescue_from AccessGranted::AccessDenied do |exception|
        error_response(message: @@access_denied, status: 406)
    end

    rescue_from ActiveRecord::RecordNotFound do |exception|
      error_response(message: {error: @@not_found, exception: exception}, status: 404)
    end

    rescue_from ActiveRecord::StatementInvalid do |exception|
      error_response(message: {error: @@sql_error, exception: exception}, status: 404)
    end
  end
end
