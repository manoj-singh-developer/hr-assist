class SmtpSettingsController < ApplicationController

  def new
    @smtp_setting = SmtpSetting.new
  end

  def create

    crypt = ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base)
    encrypted_data = crypt.encrypt_and_sign(params["smtp_settings"]["password"])

    update_option "address" , params["smtp_settings"]["address"], SmtpSetting
    update_option "port" , params["smtp_settings"]["port"], SmtpSetting
    update_option "domain" , params["smtp_settings"]["domain"], SmtpSetting
    update_option "user_name" , params["smtp_settings"]["user_name"], SmtpSetting
    update_option "password" , encrypted_data, SmtpSetting
     
    redirect_to '/admin'
  end

  private

  def app_setting_params
    params.require(:smtp_setting).permit(:address , :port, :domain , :user_name , :password)
  end

end
