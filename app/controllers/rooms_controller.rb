class RoomsController < ApplicationController
  # GET /rooms
  # GET /rooms.xml
  before_filter :connect
  before_filter :find_room

  def find_all_rooms
    @campfire.rooms
  end

  def find_room
    @room = @campfire.find_room_by_id(params[:id])
  end

  def connect
    @campfire = Tinder::Campfire.new 'challengepost', :token => 'b4d5d35d5b76618ffdb9e0cec9af2d211c61842a'
  end

  def send_message
    respond_to do |format|
      @room.speak(params[:message])
      format.html { redirect_to root_path }
      format.js {}
    end
  end

  def index
    @rooms = Room.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @rooms }
    end
  end

  # GET /rooms/1
  # GET /rooms/1.xml
  def show
    respond_to do |format|
      format.html # show.html.erb
    end
  end

  # GET /rooms/new
  # GET /rooms/new.xml
  def new
    @room = Room.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @room }
    end
  end

  # GET /rooms/1/edit
  def edit
    @room = Room.find(params[:id])
  end

  # POST /rooms
  # POST /rooms.xml
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

  # PUT /rooms/1
  # PUT /rooms/1.xml
  def update
    @room = Room.find(params[:id])

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

  # DELETE /rooms/1
  # DELETE /rooms/1.xml
  def destroy
    @room = Room.find(params[:id])
    @room.destroy

    respond_to do |format|
      format.html { redirect_to(rooms_url) }
      format.xml  { head :ok }
    end
  end
end
