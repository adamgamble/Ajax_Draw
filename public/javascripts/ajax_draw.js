var canvas;
var context;
var active;
var debug;
var timer;

$(document).ready(ready_handler);

function ready_handler() {
  //Setup variables
  canvas = document.getElementById("ajax_draw_canvas");
  debug = $('#debug')
  context = canvas.getContext("2d");
  context.lineWidth = 5;
  context.lineCap = 'round';
  active = false;

  //Setup event handlers
  $('#ajax_draw_canvas').mousedown(ajax_draw_mouse_down);
  $('#ajax_draw_canvas').mouseup(ajax_draw_mouse_up);
  $('#ajax_draw_canvas').mousemove(ajax_draw_mouse_over);
  $('#clear_button').click(clear);
  $('#refresh_button').click(update_canvas_from_remote);
  
  log("Startup Done");
  start_timer();
}
function start_timer() {
  timer = setInterval( update_canvas_from_remote, 100);
}

function stop_timer() {
  clearInterval(timer);
}

function ajax_draw_mouse_down(e) {
  active = true;
  log("Mouse Down at " + e.pageX + " : " + e.pageY)
}

function ajax_draw_mouse_up(e) {
  active = false;
  log("Mouse Up at " + e.pageX + " : " + e.pageY)
}

function update_canvas_from_remote() {
  $.getJSON('/draw', draw_from_json);
}

function draw_from_json(data) {
  $.each(data, function(index, value) {
    draw_point(value.draw.x,value.draw.y,value.draw.color);
  });
}

function draw_point(x,y,color) {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(x,y);
  context.lineTo(x + 1, y + 1);
  context.stroke();
}

function ajax_draw_mouse_over(e) {
  if (active) {
    position = $('#ajax_draw_canvas').position();
    x = e.pageX - position.left;
    y = e.pageY - position.top;
    draw_point(x,y,document.getElementById("color").value);
    $.ajax({
      type: 'POST',
      url: "/draw",
      data: "x=" + x + "&y=" + y + "&color=" + context.strokeStyle
    });
  } else {
  log("Active: " + active + " Mouse Over at " + e.pageX + " : " + e.pageY)
  }
}

function clear() {
  stop_timer();
  setTimeout(function () {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, 100);
  $.ajax({
    type: 'GET',
    url: "/draw/destroy_all"
  });
  start_timer();
}

function log(debug_text) {
  debug.html(debug_text);
}
