class RoomsController < ApplicationController
  # GET /rooms
  # GET /rooms.xml
  before_filter :find_room
  before_filter :find_all_rooms

  def index
    @rooms = Room.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @rooms }
    end
  end

  def show
    respond_to do |format|
      format.html
      format.js {
        @room_count = params[:room_count];
        @room = @current_rooms.first
      }
    end
  end

  def new
    @room = Room.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @room }
    end
  end

  def edit
  end

  def create
    @room = Room.new(params[:room])

    respond_to do |format|
      if @room.save
        format.html { redirect_to(@room, :notice => 'Room was successfully created.') }
        format.xml  { render :xml => @room, :status => :created, :location => @room }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @room.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @room.update_attributes(params[:room])
        format.html { redirect_to(@room, :notice => 'Room was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @room.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @room.destroy
    redirect_to root_url
  end

  private

  def find_all_rooms
    @rooms = @campfire.rooms unless request.xhr?
  end

  def find_room
    ids = params[:id].split("-") if params[:id]
    @current_rooms = ids.map{|id| @campfire.find_room_by_id(id)}.compact if ids
  end
  
end
