# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170320143401) do

  create_table "active_admin_comments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "namespace"
    t.text     "body",          limit: 65535
    t.string   "resource_id",                 null: false
    t.string   "resource_type",               null: false
    t.string   "author_type"
    t.integer  "author_id"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree
  end

  create_table "activities", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.text     "description", limit: 65535
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "activities_projects", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "project_id"
    t.integer "activity_id"
    t.index ["activity_id"], name: "index_activities_projects_on_activity_id", using: :btree
    t.index ["project_id"], name: "index_activities_projects_on_project_id", using: :btree
  end

  create_table "admin_users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "app_settings", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "key"
    t.string   "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "application_types", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "label"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "application_types_projects", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "project_id"
    t.integer "application_type_id"
    t.index ["application_type_id"], name: "app_types_to_projects", using: :btree
    t.index ["project_id"], name: "projects_to_app_types", using: :btree
  end

  create_table "countries", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "long_name"
    t.string   "short_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "customers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.integer  "country_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["country_id"], name: "index_customers_on_country_id", using: :btree
  end

  create_table "customers_projects", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "project_id"
    t.integer "customer_id"
    t.index ["customer_id"], name: "index_customers_projects_on_customer_id", using: :btree
    t.index ["project_id"], name: "index_customers_projects_on_project_id", using: :btree
  end

  create_table "departments", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "departments_users", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "user_id"
    t.integer "department_id"
    t.index ["department_id"], name: "index_departments_users_on_department_id", using: :btree
    t.index ["user_id"], name: "index_departments_users_on_user_id", using: :btree
  end

  create_table "devices", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.text     "description", limit: 65535
    t.integer  "total"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "devices_users", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "user_id"
    t.integer "device_id"
    t.index ["device_id"], name: "index_devices_users_on_device_id", using: :btree
    t.index ["user_id"], name: "index_devices_users_on_user_id", using: :btree
  end

  create_table "educations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name",        limit: 120
    t.string   "degree",      limit: 120
    t.text     "description", limit: 65535
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "educations_users", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "user_id"
    t.integer "education_id"
    t.index ["education_id"], name: "index_educations_users_on_education_id", using: :btree
    t.index ["user_id"], name: "index_educations_users_on_user_id", using: :btree
  end

  create_table "email_templates", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.text     "template",   limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "holiday_replacements", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "holiday_id"
    t.integer  "project_id"
    t.integer  "replacer_id"
    t.integer  "replaced_user_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["holiday_id"], name: "index_holiday_replacements_on_holiday_id", using: :btree
    t.index ["project_id"], name: "index_holiday_replacements_on_project_id", using: :btree
  end

  create_table "holidays", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "days"
    t.date     "start_date"
    t.date     "end_date"
    t.date     "signing_day"
    t.integer  "user_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["user_id"], name: "index_holidays_on_user_id", using: :btree
  end

  create_table "industries", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "label"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "industries_projects", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "project_id"
    t.integer "industry_id"
    t.index ["industry_id"], name: "index_industries_projects_on_industry_id", using: :btree
    t.index ["project_id"], name: "index_industries_projects_on_project_id", using: :btree
  end

  create_table "languages", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "long_name"
    t.string   "short_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "languages_users", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "user_id"
    t.integer "language_id"
    t.index ["language_id"], name: "index_languages_users_on_language_id", using: :btree
    t.index ["user_id"], name: "index_languages_users_on_user_id", using: :btree
  end

  create_table "positions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name",       limit: 120
    t.text     "job_detail", limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "positions_users", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "user_id"
    t.integer "position_id"
    t.index ["position_id"], name: "index_positions_users_on_position_id", using: :btree
    t.index ["user_id"], name: "index_positions_users_on_user_id", using: :btree
  end

  create_table "projects", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.text     "description",     limit: 65535
    t.date     "start_date"
    t.date     "end_date"
    t.date     "deadline"
    t.boolean  "in_progress"
    t.text     "main_activities", limit: 65535
    t.string   "url",             limit: 120
    t.string   "assist_url",      limit: 120
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  create_table "projects_technologies", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "project_id"
    t.integer "technology_id"
    t.index ["project_id"], name: "index_projects_technologies_on_project_id", using: :btree
    t.index ["technology_id"], name: "index_projects_technologies_on_technology_id", using: :btree
  end

  create_table "roles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "roles_users", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.index ["role_id"], name: "index_roles_users_on_role_id", using: :btree
    t.index ["user_id"], name: "index_roles_users_on_user_id", using: :btree
  end

  create_table "schedules", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "timetable"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_schedules_on_user_id", using: :btree
  end

  create_table "technologies", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "label"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "technologies_user_projects", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "user_project_id",  null: false
    t.integer "technology_id"
    t.integer "user_projects_id"
    t.index ["technology_id"], name: "index_technologies_user_projects_on_technology_id", using: :btree
    t.index ["user_projects_id"], name: "index_technologies_user_projects_on_user_projects_id", using: :btree
  end

  create_table "technologies_users", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "user_id"
    t.integer "technology_id"
    t.index ["technology_id"], name: "index_technologies_users_on_technology_id", using: :btree
    t.index ["user_id"], name: "index_technologies_users_on_user_id", using: :btree
  end

  create_table "trainings", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "title"
    t.text     "description", limit: 65535
    t.text     "picture",     limit: 65535
    t.date     "start_date"
    t.integer  "duration"
    t.integer  "user_id"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["user_id"], name: "index_trainings_on_user_id", using: :btree
  end

  create_table "uploads", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "file_name",        limit: 120
    t.string   "file_description"
    t.string   "path"
    t.integer  "user_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["user_id"], name: "index_uploads_on_user_id", using: :btree
  end

  create_table "user_projects", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "user_id"
    t.integer  "project_id"
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_user_projects_on_project_id", using: :btree
    t.index ["user_id"], name: "index_user_projects_on_user_id", using: :btree
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "first_name",                 limit: 45
    t.string   "middle_name",                limit: 45
    t.string   "last_name",                  limit: 45
    t.text     "address",                    limit: 65535
    t.date     "birthday"
    t.string   "phone",                      limit: 14
    t.string   "picture"
    t.text     "observations",               limit: 65535
    t.string   "email_other",                limit: 120
    t.text     "urgent_contact",             limit: 65535
    t.string   "car_plate",                  limit: 25
    t.date     "assist_start_date"
    t.text     "courses_and_certifications", limit: 65535
    t.text     "courses_date",               limit: 65535
    t.integer  "schedule_id"
    t.text     "skills_level",               limit: 65535
    t.text     "skills_type",                limit: 65535
    t.text     "project_dates",              limit: 65535
    t.integer  "status"
    t.integer  "uid"
    t.string   "auth_token"
    t.string   "email",                                    default: "", null: false
    t.string   "encrypted_password",                       default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                            default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                                            null: false
    t.datetime "updated_at",                                            null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  add_foreign_key "activities_projects", "activities"
  add_foreign_key "activities_projects", "projects"
  add_foreign_key "application_types_projects", "application_types"
  add_foreign_key "application_types_projects", "projects"
  add_foreign_key "customers", "countries"
  add_foreign_key "customers_projects", "customers"
  add_foreign_key "customers_projects", "projects"
  add_foreign_key "departments_users", "departments"
  add_foreign_key "departments_users", "users"
  add_foreign_key "devices_users", "devices"
  add_foreign_key "devices_users", "users"
  add_foreign_key "educations_users", "educations"
  add_foreign_key "educations_users", "users"
  add_foreign_key "holiday_replacements", "holidays"
  add_foreign_key "holiday_replacements", "projects"
  add_foreign_key "holidays", "users"
  add_foreign_key "industries_projects", "industries"
  add_foreign_key "industries_projects", "projects"
  add_foreign_key "languages_users", "languages"
  add_foreign_key "languages_users", "users"
  add_foreign_key "positions_users", "positions"
  add_foreign_key "positions_users", "users"
  add_foreign_key "projects_technologies", "projects"
  add_foreign_key "projects_technologies", "technologies"
  add_foreign_key "roles_users", "roles"
  add_foreign_key "roles_users", "users"
  add_foreign_key "schedules", "users"
  add_foreign_key "technologies_user_projects", "technologies"
  add_foreign_key "technologies_user_projects", "user_projects", column: "user_projects_id"
  add_foreign_key "technologies_users", "technologies"
  add_foreign_key "technologies_users", "users"
  add_foreign_key "trainings", "users"
  add_foreign_key "uploads", "users"
  add_foreign_key "user_projects", "projects"
  add_foreign_key "user_projects", "users"
end
