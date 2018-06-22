FactoryGirl.define do
  factory :user do
    email "example@mail.com"
    password  "password"
    auth_token Devise.friendly_token
    last_sign_in_at Time.now

    trait :employee do
        after(:create) do |user|
          user.roles << create(:role, :employee)
        end
    end

    trait :admin do
      after(:create) do |user|
        user.roles << create(:role, :admin)
      end
    end


  end
end