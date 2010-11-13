class DrawController < ApplicationController
  def index
    dots = Draw.all
    dot_array = []
    dots.each do |dot|
      dot_array << {:x => dot.x, :y => dot.y, :color => dot.color}
    end
    render :json => dot_array
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
