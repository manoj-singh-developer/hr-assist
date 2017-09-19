class Device < ApplicationRecord
  belongs_to :user
  has_many :user_device_specifications, dependent: :destroy

  scope :by_component, ->(components) { where(id: UserDeviceSpecification.where(hardware_component_id: HardwareComponent.where(name: components).pluck(:id)).pluck(:device_id)) }

  def serializable_hash(options={})
    super({include: [:created_at, :updated_at]})
  end
end
