module Responses
  def success hash = {}
    {status: :success}.merge(hash)
  end
  def error hash = {}
    {status: :error}.merge(hash)
  end
end