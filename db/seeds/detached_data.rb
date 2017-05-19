languages = ActiveSupport::JSON.decode(File.read("db/seeds/languages.json"))

languages.each do |lang|
  Language.populate 1 do |language|
      language.long_name = lang["name"]
      language.short_name = lang["short_name"]
  end
end

projects = ActiveSupport::JSON.decode(File.read("db/seeds/projects.json"))

projects.each do |proj|
  Project.populate 1 do |project|
    project.name = proj["name"]
    project.description = proj["description"]
    project.assist_url = proj["projectUrl"]
  end
end

extra_data = ActiveSupport::JSON.decode(File.read("db/seeds/extra_data.json"))
technologies = extra_data["technologies"]
application_types = extra_data["applicationTypes"]
industries = extra_data["industries"]
customers = extra_data["customers"]

technologies.each do |tech|
  Technology.populate 1 do |technology|
    technology.name = tech
  end
end

application_types.each do |app|
  ApplicationType.populate 1 do |app_type|
    app_type.name = app
  end
end

industries.each do |ind|
  Industry.populate 1 do |industry|
    industry.name = ind
  end
end

customers.each do |cust|
  Customer.populate 1 do |customer|
    customer.name = cust
  end
end

positions = ActiveSupport::JSON.decode(File.read("db/seeds/positions.json"))

positions.each do |pos|
  Position.populate 1 do |position|
    position.name = pos
  end
end

countries = ActiveSupport::JSON.decode(File.read("db/seeds/countries.json"))

countries.each do |coun|
  Country.populate 1 do |country|
    country.short_name = coun[0]
    country.long_name = coun[1]
  end
end

roles = [{name: :admin, description: "Administrator role"},{name: :employee, description: "Employee role"}]

roles.each do |role|
  Role.populate 1 do |rol|
      rol.name = role[:name]
      rol.description = role[:description]
  end
end