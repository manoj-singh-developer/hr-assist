class ApplicationTypeProject < ApplicationRecord
  belongs_to :application_type
  belongs_to :project
end
