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
  has_and_belongs_to_many :languages
  has_and_belongs_to_many :devices
  has_and_belongs_to_many :educations
  has_and_belongs_to_many :departments
  has_and_belongs_to_many :technologies
  has_and_belongs_to_many :roles
  has_many :holidays
  has_many :holiday_replacements, through: :holidays
  has_many :replacers, through: :holiday_replacements
  has_many :replaced_users, through: :holiday_replacements, inverse_of: :replaced_user
  has_many :trainings
  has_many :user_projects
  has_many :user_technologies
  has_many :technologies, through: :user_technologies
  has_many :projects, through: :user_projects

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
