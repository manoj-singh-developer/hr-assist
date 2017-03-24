class ApplicationApi < Grape::API
  mount V1::Root
end