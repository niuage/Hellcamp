class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :connect

  def connect
    @campfire = Tinder::Campfire.new 'challengepost', :token => 'b4d5d35d5b76618ffdb9e0cec9af2d211c61842a'
  end
end
