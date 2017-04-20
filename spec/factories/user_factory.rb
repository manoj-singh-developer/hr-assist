FactoryGirl.define do
  factory :user do
    email "example@mail.com"
    password  "password"
    auth_token Devise.friendly_token
    last_sign_in_at Time.now

    trait :with_role do
        after(:create) do |user|
          user.roles << create(:role)
        end
    end
  end
end