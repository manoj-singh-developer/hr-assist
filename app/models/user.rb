class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :ldap_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_one :schedule
  has_many :uploads
  has_many :user_positions
  has_many :positions, through: :user_positions
  has_many :user_languages
  has_many :languages, through: :user_languages
  has_many :user_equipments
  has_many :equipments, through: :user_equipments
  has_many :holidays
  has_many :holiday_replacements, through: :holidays
  has_many :replacers, through: :holiday_replacements
  has_many :replaced_users, through: :holiday_replacements, inverse_of: :replaced_user
  has_many :user_educations
  has_many :educations, through: :user_educations
  has_many :trainings
  has_many :user_projects
  has_many :projects, through: :user_projects
  has_many :user_departments
  has_many :departments, through: :user_departments
  has_many :user_technologies
  has_many :technologies, through: :user_technologies

end
