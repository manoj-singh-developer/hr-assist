class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  devise :ldap_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessor :skip_password_validation

  def get_ldap_info
    self.email = Devise::LDAP::Adapter.get_ldap_param(self.email,"mail").first
    self.first_name = Devise::LDAP::Adapter.get_ldap_param(self.email,"givenName").first
    self.last_name = Devise::LDAP::Adapter.get_ldap_param(self.email,"sn").first
    self.uid = Devise::LDAP::Adapter.get_ldap_param(self.email,"uidNumber").first
  end

  has_one :schedule
  has_many :uploads
  has_and_belongs_to_many :positions
  #has_and_belongs_to_many :languages
  has_and_belongs_to_many :devices
  has_and_belongs_to_many :educations
  has_and_belongs_to_many :certifications
  has_and_belongs_to_many :departments
  has_and_belongs_to_many :technologies
  has_and_belongs_to_many :roles
  has_many :holidays, :dependent => :destroy
  has_many :holiday_replacements, through: :holidays
  has_many :replacers, through: :holiday_replacements
  has_many :replaced_users, through: :holiday_replacements, inverse_of: :replaced_user
  has_many :trainings
  has_many :user_projects
  has_many :languages, through: :user_languages
  has_many :user_languages
  has_many :user_technologies
  has_many :technologies, through: :user_technologies
  has_many :projects, through: :user_projects

  scope :by_year_and_month_birth, ->(date) { where("YEAR(birthday) = ? and MONTH(birthday) = ?", date.year, date.month) }
  scope :by_company_start_date_until_present, ->(date) { where("YEAR(company_start_date) >= ? and MONTH(company_start_date) between 1 and ?", date.year, date.month) }
  scope :by_university_year, ->(year) { joins(:educations).where("end_date IS NULL").where("YEAR(start_date) = ? and MONTH(start_date) < 9", year) }
  scope :by_projects, ->(ids) { joins(:projects).where(projects: {id: ids} ) }
  scope :by_technologies, ->(ids) { joins(:technologies).where(technologies: {id: ids} ) }
  scope :by_certifications, ->(ids) { joins(:certifications).where(certifications: {id: ids} ) }
  scope :by_languages, ->(ids) { joins(:user_languages).where(languages_users: {language_id: ids} ) }

  def ensure_authentication_token
    self.last_sign_in_at = Time.now
    self.auth_token = generate_access_token
  end

  def is_admin
    self.roles.first.name == 'admin' ? true : false
  end

  def is_employee
    self.roles.first.name == 'employee' ? true : false
  end

  def name
    "#{self.first_name} #{self.last_name}"
  end

  def get_user_languages
    user_language = UserLanguage.where(user_id: self.id)
    result = []
    user_language.each do |lang|
      partial_result = {}
      language = Language.find(lang.language_id)
      partial_result[:language_id] = language.id
      partial_result[:long_name] = language.long_name
      partial_result[:level] = lang.level
      result << partial_result
    end
    result
  end

  def get_user_technologies
    user_technology = UserTechnology.where(user_id: self.id)
    result = []
    user_technology.each do |tech|
      partial_result = {}
      technology = Technology.find(tech.technology_id)
      partial_result[:technology_id] = technology.id
      partial_result[:name] = technology.name
      partial_result[:level] = tech.level
      result << partial_result
    end
    result
  end

  private

  def generate_access_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(auth_token: token).first
    end
  end

  protected
  def password_required?
    return false if skip_password_validation
    super
  end

end
