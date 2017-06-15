class CandidateCv < ApplicationRecord

    VALID_CONTENT_TYPES = ["application/pdf", "application/x-pdf"]

    has_attached_file :cv,
                    :path => ":rails_root/public/system/:class/:attachment/:id/:style/:filename",
                    :url  => "/system/:class/:attachment/:id/:style/:filename"
    validates_attachment :cv, presence: true, content_type: { content_type: ["application/pdf", "application/octet-stream"] }

    validate :attachment_content_type

    before_validation(:on => :create) do |file|
        if file.cv_content_type == 'application/octet-stream'
            mime_type = MIME::Types.type_for(file.cv_file_name)    
            file.cv_content_type = mime_type.first.content_type if mime_type.first
        end
    end

    def attachment_content_type
        errors.add(:media, "type is not allowed") unless VALID_CONTENT_TYPES.include?(self.cv_content_type)
    end
end
