class HomeController < ApplicationController

  before_filter :find_room, :only => [:server]
  before_filter :find_all_rooms

  def server
    Resque.enqueue(Server, @room.id)
  end

  def index
  end

  protected

  def find_all_rooms
    @rooms = @campfire.rooms
  end

  def find_room
    @room = @campfire.find_room_by_name(params[:room])
  end

end
