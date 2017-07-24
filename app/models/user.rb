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

  def self.union_scope(pair_ids,table)
    result = []
    pair_ids.each do |ids|
      ids[1]  ||= "'%'"
      if table == "technologies"
        ActiveRecord::Base.connection.execute("SELECT users.id FROM users INNER JOIN user_technologies ON user_technologies.user_id = users.id where user_technologies.technology_id = #{ids[0]} AND user_technologies.level LIKE #{ids[1]}").each do |query|
          result << query
        end
      elsif table == "languages"
        ActiveRecord::Base.connection.execute("SELECT users.id FROM users INNER JOIN languages_users ON languages_users.user_id = users.id where languages_users.language_id = #{ids[0]} AND languages_users.level LIKE #{ids[1]}").each do |query|
          result << query
        end
      end
    end
    User.where(id: result.flatten)
  end


  has_one :schedule
  has_many :uploads
  has_and_belongs_to_many :positions
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

  scope :by_month_birth, ->(date) { where("MONTH(birthday) = ?", date.month) }
  scope :by_company_start_date_until_present, ->(date) { where("YEAR(company_start_date) >= ? and MONTH(company_start_date) between 1 and ?", date.year, date.month) }
  scope :by_university_year, ->(year) { joins(:educations).where("end_date IS NULL").where("YEAR(start_date) = ? and MONTH(start_date) < 9", year) }
  scope :by_projects, ->(ids) { joins(:projects).where(projects: {id: ids} ) }
  scope :by_certifications, ->(certification_name) { joins(:certifications).where(certifications: {name: certification_name})  }
  scope :by_technology_id_and_level, ->(ids) {union_scope(ids,"technologies")}
  scope :by_language_id_and_level, ->(ids) {union_scope(ids,"languages")}

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
