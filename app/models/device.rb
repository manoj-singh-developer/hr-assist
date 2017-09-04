class Device < ApplicationRecord
  belongs_to :user
  has_many :user_device_specifications, :dependent => :destroy
  def serializable_hash(options={})
    super({include: [:created_at, :updated_at]})
  end
end
