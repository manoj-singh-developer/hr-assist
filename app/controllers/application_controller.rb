class ApplicationController < ActionController::Base
  
  rescue_from DeviseLdapAuthenticatable::LdapException do |exception|
    render :text => exception, :status => 500
  end

  protect_from_forgery with: :exception
  layout 'application'

  before_filter :authenticate_admin_user!

  def createOption hash
    AppSetting::create([key: hash.key, value: hash.value])
  end

  def updateOption key, value
    AppSetting::where(key: key).update(value: value)
  end

  def getOption key
    AppSetting::where(key: key).first[:value]
  end

  def decrypt var
    ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base).decrypt_and_verify(var) unless (var) == ""
  end

  helper_method :getOption , :createOption , :updateOption , :decrypt
end
