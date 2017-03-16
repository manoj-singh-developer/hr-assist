module APIHelpers

  def url_paginate(collection, per_page)
    
    @@per_page = per_page

    {
      :first => url_for(1),
      :previous => url_for(collection.prev_page),
      :self => url_for(collection.current_page),
      :next => url_for(collection.next_page),
      :last => url_for(collection.total_pages)
    }
  end

  def url_for(page)
    return nil if !page

    url = request.base_url + request.path + "/?page=#{page}"
    url += "&per_page=#{@@per_page}" if @@per_page
    url
  end
end