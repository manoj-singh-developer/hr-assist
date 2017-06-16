class CandidateCv < ApplicationRecord

  has_attached_file :cv,
                  :path => ":rails_root/public/system/:class/:id/:style/:filename",
                  :url  => "/system/:class/:id/:style/:filename"
  validates_attachment :cv, presence: true, content_type: { content_type: ['application/pdf', 'application/x-pdf'] }

  def serializable_hash(options = {})  
    result = super(options)
    result[:cv_url] = cv_url
    result
  end

  def cv_url
    self.cv.url
  end
end
