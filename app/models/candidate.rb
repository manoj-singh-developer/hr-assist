class Candidate < ApplicationRecord
    has_one :candidate_cv, :class_name => "CandidateCv"
    has_many :candidate_files

end
