module Authentication
  def current_user
    return nil if headers['Token'].nil?
    
    @current_user ||= User.find_by_auth_token(headers['Token'])
    
    return error!('400 Invalid Token', 400) if @current_user.blank?

    return error!('400 Token Expired', 400) if @current_user.last_sign_in_at + Rails.application.config.expiration_token_time < Time.now
    
    @current_user
  end

  def authenticate!
    error!('401 Unauthorized', 401) unless current_user
  end
end
