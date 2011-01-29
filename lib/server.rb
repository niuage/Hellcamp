class Server
  @queue = :servers

  def self.perform room_id
    campfire = Tinder::Campfire.new 'challengepost', :token => 'b4d5d35d5b76618ffdb9e0cec9af2d211c61842a'
    room = campfire.find_room_by_id(room_id) if room_id
    room.listen do |m|
      Juggernaut.publish(room_id, m)
    end if room
  end
end