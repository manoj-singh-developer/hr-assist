class AppSettingsController < ApplicationController

  def new
    @app_setting = AppSetting.new
  end

  def create

    crypt = ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base)
    encrypted_data = crypt.encrypt_and_sign(params["app_settings"]["ldap_password"])

    update_option "ldap_host" , params["app_settings"]["host"], AppSetting
    update_option "ldap_port" , params["app_settings"]["port"], AppSetting
    update_option "ldap_account" , params["app_settings"]["account"], AppSetting
    update_option "ldap_basedn" , params["app_settings"]["baseDN"], AppSetting
    update_option "ldap_filter" , params["app_settings"]["ldap_filter"], AppSetting
    update_option "ldap_password" , encrypted_data, AppSetting

    redirect_to '/admin'
  end

  private

  def app_setting_params
    params.require(:app_setting).permit(:host , :port, :account , :baseDN , :ldap_filter , :ldap_password)
  end

end
