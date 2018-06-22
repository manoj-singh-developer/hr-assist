FactoryGirl.define do
  factory :role do

    trait :admin do
      after(:create) do |role|
        role.name = "admin"
        role.description = "Administrator"
      end
    end

    trait :employee do
      after(:create) do |role|
        role.name = "employee"
        role.description = "Employee role"
      end
    end

  end
end