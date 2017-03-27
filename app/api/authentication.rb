module Authentication
  def current_user
    return nil if headers['Token'].nil?
    @current_user ||= User.find_by_auth_token(headers['Token'])
  end

  def authenticate!
    error!('401 Unauthorized', 401) unless current_user
  end
end