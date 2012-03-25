class HomeController < ApplicationController

  def index
    @preview = Preview.new
  end

end
