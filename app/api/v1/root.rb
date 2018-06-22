require "grape-swagger"

module V1
    class Root < Grape::API
        format :json

        mount V1::ActivityAPI
        mount V1::ApplicationTypeAPI
        # mount V1::CountryAPI
        mount V1::CandidateAPI
        mount V1::CustomerAPI
        mount V1::DepartmentAPI
        mount V1::DeviceAPI
        mount V1::EducationAPI
        mount V1::HolidayAPI
        # mount V1::HolidayReplacementAPI
        mount V1::IndustryAPI
        mount V1::LanguageAPI
        mount V1::PositionAPI
        mount V1::ProjectAPI
        mount V1::ScheduleAPI
        mount V1::TechnologyAPI
        mount V1::TrainingAPI
        mount V1::UploadAPI
        mount V1::ComponentAPI
        mount V1::Users::UserAPI
        mount V1::Users::Relations::CertificationAPI
        mount V1::Users::Relations::DeviceAPI
        mount V1::Users::Relations::EducationAPI
        mount V1::Users::Relations::HolidayAPI
        mount V1::Users::Relations::LanguageAPI
        mount V1::Users::Relations::PositionAPI
        mount V1::Users::Relations::ProjectAPI
        mount V1::Users::Relations::ScheduleAPI
        mount V1::Users::Relations::TechnologyAPI
        mount V1::Users::Relations::UploadAPI
        mount V1::Users::Relations::DepartmentAPI

        add_swagger_documentation(
            api_version: "v1",
            hide_documentation_path: true,
            mount_path: "/api/v1/swagger_doc",
            hide_format: true
        )
    end
end
