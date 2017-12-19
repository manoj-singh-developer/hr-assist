class Admin::DomainController < ApplicationController

  def index
    @allowed_domains = Domain.all.pluck(:allowed_domain)
  end

  def new
    Domain.create(allowed_domain: params[:domains][:allowed_domain])
    redirect_to '/admin'
  end

end
