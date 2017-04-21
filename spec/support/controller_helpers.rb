module ControllerHelpers

    def json
        @json ||= JSON.parse(response.body)
    end

    def seed_data credentials

        crypt          = ActiveSupport::MessageEncryptor.new(Rails.application.secrets.secret_key_base)
        encrypted_data = crypt.encrypt_and_sign(credentials['ldap_password'])

        AppSetting.create!(key: 'ldap_host' , value: credentials['ldap_host'])
        AppSetting.create!(key: 'ldap_port' , value: credentials['ldap_port'])
        AppSetting.create!(key: 'ldap_account' , value: credentials['ldap_account'])
        AppSetting.create!(key: 'ldap_password' , value: encrypted_data)
        AppSetting.create!(key: 'ldap_basedn' , value: credentials['ldap_basedn'])

    end

end