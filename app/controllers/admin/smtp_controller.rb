class Admin::SmtpController < ApplicationController

  def index
    redirect_to '/admin'
  end

  def show
    respond_to do |format|
      format.js {render layout: false}
    end
  end

end