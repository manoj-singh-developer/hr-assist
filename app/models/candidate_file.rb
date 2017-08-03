class CandidateFile < ApplicationRecord

  def as_json(options={})
    options[:methods] = [:file_url]
    super
  end

  has_attached_file :file,
                  :path => ":rails_root/public/system/:class/:id/:style/:filename",
                  :url  => "/system/:class/:id/:style/:filename"
  validates_attachment :file, presence: true, content_type: { content_type: ['application/mp3', 'application/x-mp3', 'audio/mpeg', ['audio/mpeg'], 'audio/mp3', 'video/mp4'] }

  def serializable_hash(options = {})  
    result = super(options)
    result[:file_url] = file_url
    result
  end

  def file_url
    self.file.url
  end
end
