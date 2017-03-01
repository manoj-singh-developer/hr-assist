# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
languages = [{long_name: "English", short_name: "en"}, {long_name: "German", short_name: "de"},{ long_name: "French", short_name: "fr"}]

languages.each do |lang|
  Language.populate 1 do |language|
      language.long_name = lang[:long_name]
      language.short_name = lang[:short_name]
  end
end

ApplicationType.populate 3 do |app|
  app.name = Faker::Name.name
  app.label = Faker::Name.name
end

Industry.populate 3 do |industry|
  industry.name = Faker::Name.name
  industry.label = Faker::Name.name
end

Activity.populate 3 do |activity|
  activity.name = Faker::Name.name
  activity.description = Faker::Lorem.sentence
end

Technology.populate 3 do |tech|
  tech.name = Faker::Name.name
  tech.label = Faker::Name.name
end

Country.populate 4 do |country|
  country.long_name = Faker::Address.country
  country.short_name = Faker::Address.country_code
end

Customer.populate 3 do |customer|
  country = Country.all[Random.new.rand(Country.count)]
  customer.name = Faker::Name.name
  customer.country_id = country.id
end

Project.populate 5 do |project|
  project.name = Faker::Name.name
  project.description = Faker::Lorem.sentence
  project.start_date = Faker::Date.forward(3)
  project.end_date = Faker::Date.forward(20)
  project.deadline = Faker::Date.forward(22)
  project.in_progress = Faker::Boolean.boolean
  project.main_activities = Faker::Lorem.sentence
  project.url = Faker::Internet.url
  project.assist_url = Faker::Internet.url('assist.ro')
  industry = Industry.all[Random.new.rand(Industry.count)]
  ProjectIndustry.populate 1 do |pri|
    pri.project_id = project.id
    pri.industry_id = industry.id
  end
  application_type = ApplicationType.all[Random.new.rand(ApplicationType.count)]
  ApplicationTypeProject.populate 1 do |app|
    app.application_type_id = application_type.id
    app.project_id = project.id
  end
  activity = Activity.all[Random.new.rand(Activity.count)]
  ActivityProject.populate 1 do |act|
    act.activity_id = activity.id
    act.project_id = project.id
  end
  technology = Technology.all[Random.new.rand(Technology.count)]
  ProjectTechnology.populate 1 do |proj|
    proj.project_id = project.id
    proj.technology_id = technology.id
  end
  customer = Customer.all[Random.new.rand(Customer.count)]
  CustomerProject.populate 1 do |customer|
    customer.customer_id = customer.id
    customer.project_id = project.id
  end
end

Education.populate 3 do |education|
  education.name = Faker::Name.name
  education.degree = Faker::Lorem.sentence
  education.description = Faker::Lorem.sentence
  education.start_date = Faker::Date.forward(2)
  education.end_date = Faker::Date.forward(5)
end

Position.populate 3 do |position|
  position.name = Faker::Company.profession
  position.job_detail = Faker::Educator.course
end

Equipment.populate 3 do |equipment|
  equipment.name = Faker::Name.name
  equipment.description = Faker::Lorem.sentence
  equipment.total = Faker::Number.number(2)
end

Department.populate 3 do |depart|
  depart.name = Faker::Company.name
  depart.description = Faker::Company.catch_phrase
end

User.populate 10 do |user|
  user.first_name = Faker::Name.first_name
  user.last_name = Faker::Name.last_name
  user.address = Faker::Address.street_address
  user.birthday = Faker::Date.birthday
  user.phone = Faker::PhoneNumber.cell_phone
  user.picture = Faker::Avatar.image
  user.observations = Faker::Lorem.sentence
  user.email_other = Faker::Internet.email
  user.urgent_contact = Faker::Name.name_with_middle
  user.car_plate = Faker::Vehicle.vin
  user.assist_start_date = Faker::Date.backward(1000)
  user.courses_and_certifications = Faker::Lorem.sentence
  user.skills_level = Faker::Lorem.word
  user.project_dates =Faker::Date.backward(20)
  user.status = Faker::Number.between(0,2)
  user.email = Faker::Internet.email
  user.encrypted_password = Faker::Internet.password
  user.sign_in_count = Faker::Number.between(0,10)
  language = Language.all[Random.new.rand(3)]
  UserLanguage.populate 1 do |ul|
    ul.user_id = user.id
    ul.language_id = language.id
  end
  Holiday.populate 2 do |holiday|
    holiday.user_id = user.id
    holiday.days = Faker::Number.between(1,3)
    holiday.start_date = Faker::Date.forward(2)
    holiday.end_date = Faker::Date.forward(5)
 end
 UserProject.populate 1+Random.new.rand(2) do |upr|
    project = Project.all[Random.new.rand(Project.count)]
    upr.user_id = user.id
    upr.project_id = project.id
    upr.start_date = Faker::Date.forward(1)
    upr.end_date = Faker::Date.forward(6)
    technology = Technology.all[Random.new.rand(Technology.count)]
    UserProjectTechnology.populate 1 do |upt|
      upt.user_project_id = upr.id
      upt.technology_id = technology.id
    end
  end
  education = Education.all[Random.new.rand(Education.count)]
  UserEducation.populate 1 do |ue|
    ue.education_id = education.id
    ue.user_id = user.id
  end
  Upload.populate 1 do |upload|
    upload.file_name = Faker::Name.name
    upload.file_description = Faker::Lorem.sentence
    upload.path = Faker::Internet.url
    upload.user_id = user.id
  end
  position = Position.all[Random.new.rand(Position.count)]
  UserPosition.populate 1 do |up|
    up.user_id = user.id
    up.position_id = position.id
  end
  equipment = Equipment.all[Random.new.rand(Equipment.count)]
  UserEquipment.populate 1 do |ue|
    ue.user_id = user.id
    ue.equipment_id = equipment.id
  end
  Training.populate 1 do |training|
    training.title = Faker::Educator.course
    training.description = Faker::Lorem.sentence
    training.picture = Faker::Avatar.image
    training.start_date = Faker::Date.forward(6)
    training.duration = Faker::Number.number(2)
    training.user_id = user.id
  end
  department = Department.all[Random.new.rand(Department.count)]
  UserDepartment.populate 1 do |ud|
    ud.user_id = user.id
    ud.department_id = department.id
  end
  Schedule.populate 1 do |schedule|
    schedule.name = Faker::Educator.course
    schedule.user_id = user.id
    schedule.timetable = Faker::Number.between(0,1).to_s
  end
  technology = Technology.all[Random.new.rand(Technology.count)]
  UserTechnology.populate 1 do |utech|
    utech.user_id = user.id
    utech.technology_id = technology.id
  end
end

Holiday.all.each do |holiday|
  current_user = holiday.user
  user_projects = current_user.projects
  random_user =  (User.all - [current_user])[Random.new.rand(User.count-1)]
  user_projects.each do |user_project|
    HolidayReplacement.populate 1 do |hr|
      hr.replacer_id = random_user.id
      hr.replaced_user_id = current_user.id
      hr.project_id = user_project.id
      hr.holiday_id = holiday.id
    end
  end
end


