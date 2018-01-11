class ApplicationController < ActionController::Base
  
  rescue_from DeviseLdapAuthenticatable::LdapException do |exception|
    render :text => exception, :status => 500
  end

  protect_from_forgery with: :exception
  layout 'application'

  #before_filter :authenticate_admin_user!

  # def createOption hash
  #   AppSetting::create([key: hash.key, value: hash.value])
  # end

  # def updateOption key, value
  #   AppSetting::where(key: key).update(value: value)
  # end

  # def getOption key
  #   AppSetting::where(key: key).first[:value]
  # end

  # def decrypt var
  #   ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base).decrypt_and_verify(var) unless (var) == ""
  # end


  def create_option(hash, model)
    model::create([key: hash.key, value: hash.value])
  end

  def update_option(key, value, model)
    model::where(key: key).update(value: value)
  end

  def get_option(key, model)
    model::where(key: key).first[:value]
  end

  def decrypt(var)
    ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base).decrypt_and_verify(var) unless (var) == ""
  end

  # def ScreateOption hash
  #   SmtpSetting::create([key: hash.key, value: hash.value])
  # end

  # def SupdateOption key, value
  #   SmtpSetting::where(key: key).update(value: value)
  # end

  # def SgetOption key
  #   SmtpSetting::where(key: key).first[:value]
  # end

  # def Sdecrypt var
  #   ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base).decrypt_and_verify(var) unless (var) == ""
  # end

  helper_method :get_option , :create_option , :update_option , :decrypt

end

