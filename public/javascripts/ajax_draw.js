var canvas;
var context;
var active;
var debug;
var timer;
var last_refresh;

$(document).ready(ready_handler);

function ready_handler() {
  //Setup variables
  canvas = document.getElementById("ajax_draw_canvas");
  debug = $('#debug')
  context = canvas.getContext("2d");
  context.lineWidth = 2;
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
  timer = setInterval( update_canvas_from_remote, 300);
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
  $.getJSON('/draw', 'since=' + last_refresh, draw_from_json);
  last_refresh = get_current_date();
}

function get_current_date() {
  currentTime = new Date();
  month   = currentTime.getMonth() + 1;
  day     = currentTime.getDate();
  year    = currentTime.getFullYear();
  hours   = currentTime.getHours();
  minutes = currentTime.getMinutes();
  seconds = currentTime.getSeconds();
  return day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + 0;
}

function draw_from_json(data) {
  $.each(data, function(index, value) {
    draw_point(value.x,value.y,value.color);
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
