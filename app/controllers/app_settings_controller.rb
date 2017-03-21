class AppSettingsController < ApplicationController

  def new
    @app_setting = AppSetting.new
  end

  def create

    crypt = ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base)
    encrypted_data = crypt.encrypt_and_sign(params["app_settings"]["ldap_password"])

    updateOption "ldap_host" , params["app_settings"]["host"]
    updateOption "ldap_port" , params["app_settings"]["port"]
    updateOption "ldap_account" , params["app_settings"]["account"]
    updateOption "ldap_basedn" , params["app_settings"]["baseDN"]
    updateOption "ldap_filter" , params["app_settings"]["ldap_filter"]
    updateOption "ldap_password" , encrypted_data

    redirect_to '/admin'
  end

  private

  def app_setting_params
    params.require(:app_setting).permit(:host , :port, :account , :baseDN , :ldap_filter , :ldap_password)
  end

end
