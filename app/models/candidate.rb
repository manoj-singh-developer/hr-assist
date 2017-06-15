class Candidate < ApplicationRecord
    has_one :candidate_cv
    has_many :candidate_files

end
