class Admin::HolidayController < ApplicationController
include APIHelpers
include Authentication

  def accept
    accept = Holiday.where(user_id: params[:user_id]).last
    accept.approve_holiday = true
    accept.save
  end
  def decline
    accept = Holiday.where(user_id: params[:user_id]).last
    accept.approve_holiday = false
    accept.save
  end
end
