class MessagesController < ApplicationController

  before_filter :find_room

  def create
    respond_to do |format|
      @room.speak(params[:message])
      format.html { redirect_to root_path }
      format.js {}
    end
  end

  private

  def find_room
    @room = @campfire.find_room_by_id(params[:room_id])
  end

end
