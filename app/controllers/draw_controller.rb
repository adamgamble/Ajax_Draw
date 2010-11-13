class DrawController < ApplicationController
  def index
    render :json => Draw.all.to_json
  end

  def create
    d       = Draw.new
    d.x     = params["x"]
    d.y     = params["y"]
    d.color = params["color"]
    d.save
    render :nothing => true
  end

  def destroy_all
    Draw.destroy_all
    render :nothing => true
  end
end
