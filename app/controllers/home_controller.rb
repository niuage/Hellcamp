class HomeController < ApplicationController

  def server
    Resque.enqueue(Server, @room.name)
  end

  def index
  end

  private

end
