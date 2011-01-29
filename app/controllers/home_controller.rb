class HomeController < ApplicationController

  before_filter :connect
  before_filter :find_all_rooms

  def find_all_rooms
    @rooms = @campfire.rooms
  end

  def connect
    @campfire = Tinder::Campfire.new 'challengepost', :token => 'b4d5d35d5b76618ffdb9e0cec9af2d211c61842a'
  end

  def server
    Resque.enqueue(Server, @room.name)
  end

  def index
  end

  private

end
