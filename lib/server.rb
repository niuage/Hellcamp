class Server
  @queue = :servers

  def self.perform room_name
    campfire = Tinder::Campfire.new 'challengepost', :token => 'b4d5d35d5b76618ffdb9e0cec9af2d211c61842a'
    room = campfire.find_room_by_name(room_name) if room_name
    room.listen do |m|
      Juggernaut.publish(room.id, m)
    end
  end
end