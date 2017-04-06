class Device < ApplicationRecord
  has_and_belongs_to_many :users
  def serializable_hash(options={})
    super({include: [:created_at, :updated_at]})
  end
end
