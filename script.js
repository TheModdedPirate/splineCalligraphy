window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

var c = document.getElementById("canv");
var $ = c.getContext("2d");

var msX = 0;
var msY = 0;

// [ top && left ]
var t = 0;
var l = 0;

var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;

$.fillStyle = "hsla(0, 0%, 0%, 1)";
$.lineWidth = 0.2;

var _x;
var _y;

var vx;
var vy;

var accel;
var decel;
var dist_w;

var _pX = [];
var _pY = [];
var _p1X = [];
var _p1Y = [];

var rndCol = function(alpha) {
  var r = (Math.floor(Math.random() * 255));
  var g = (Math.floor(Math.random() * 225));
  var b = (Math.floor(Math.random() * 255));
  if (alpha) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + '1)';
  } else {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
}
var grd = $.createLinearGradient(0, 0, w, 1);
grd.addColorStop("0", "hsla(0, 10%, 15%, 1)");
grd.addColorStop("0.1", "hsla(255, 255%, 255%, 1)");
grd.addColorStop("0.15", "hsla(255, 255%, 255%, 1)");
grd.addColorStop("0.2", "hsla(0,15%,25%,.7)");
grd.addColorStop("0.25", rndCol());
grd.addColorStop("0.3", rndCol());
grd.addColorStop("0.35", rndCol());
grd.addColorStop("0.4", "hsla(255, 255%, 255%, .7)");
grd.addColorStop("0.45", "hsla(255, 255%, 255%, .5)");
grd.addColorStop("0.5", "hsla(255, 255%, 255%, .4)");
grd.addColorStop("0.55", rndCol());
grd.addColorStop("0.6", rndCol());
grd.addColorStop("0.65", "hsla(0, 10%, 25%, .4)");
grd.addColorStop("0.7", "hsla(255, 255%, 255%, 1)");
grd.addColorStop("0.75", rndCol());
grd.addColorStop(".8", rndCol());
grd.addColorStop(".85", rndCol());
grd.addColorStop(".9", "hsla(255, 255%, 255%, .55)");
grd.addColorStop(".95", "hsla(255, 255%, 255%, .85)");
grd.addColorStop(".10", "hsla(255, 255%, 255%, .65)");


var txt = function() {
  $.fillStyle = grd;

  var t1 = "Spline Calligraphy".split("").join(String.fromCharCode(0x2004));
  $.font = "5em Poiret One";
  $.fillText(t1, w / 2 - 500, h / 4 - 100);

  var t2 = "Click / Tap to Reset".split("").join(String.fromCharCode(0x2004));
  $.font = "1.5em Poiret One";
  $.fillText(t2, w / 2 - 150, h - 50);
}

var set = function() {
  
  $.fillStyle = "hsla(0, 0%, 5%, 1)";
  $.fillRect(0, 0, w, h);
  txt();

  vx = vy = 0.0;
  _x = msX;
  _y = msY;

  accel = 0.15;
  decel = 0.96;
  dist_w = 0.045;

  _pX = [_x, _x, _x];
  _pY = [_y, _y, _y];
  _p1X = [_x, _x, _x];
  _p1Y = [_y, _y, _y];
}

var draw = function() {
  var px = _x;
  var py = _y;

  _x += vx += (msX - _x) * accel;
  _y += vy += (msY - _y) * accel;

  var x0 = px + vy * dist_w;
  var y0 = py - vx * dist_w;
  var x1 = px - vy * dist_w;
  var y1 = py + vx * dist_w;

  $.fillStyle = grd;

  $.beginPath();
  _fill(_pX[0], _pY[0], _pX[1], _pY[1], _pX[2], _pY[2], x0, y0,
    _p1X[0], _p1Y[0], _p1X[1], _p1Y[1], _p1X[2], _p1Y[2], x1, y1);
  $.fill();

  $.beginPath();
  curl(_pX[0], _pY[0], _pX[1], _pY[1], _pX[2], _pY[2], x0, y0);
  curl(_p1X[0], _p1Y[0], _p1X[1], _p1Y[1], _p1X[2], _p1Y[2], x1, y1);
  $.strokeStyle = grd;
  $.stroke();

  _pX.shift();
  _pX.push(x0);
  _pY.shift();
  _pY.push(y0);
  _p1X.shift();
  _p1X.push(x1);
  _p1Y.shift();
  _p1Y.push(y1);

  vx *= decel;
  vy *= decel;
}

var run = function() {
  window.requestAnimFrame(run);
  draw();
}


//[ spline ]
var spl = function(x0, y0, x1, y1, x2, y2, x3, y3) {
  $.bezierCurveTo(
    x1 + (x2 - x0) / 6.0,
    y1 + (y2 - y0) / 6.0,
    x2 - (x3 - x1) / 6.0,
    y2 - (y3 - y1) / 6.0,
    x2, y2
  );
}

var curl = function(x0, y0, x1, y1, x2, y2, x3, y3) {
  $.moveTo(x1, y1);
  spl(x0, y0, x1, y1, x2, y2, x3, y3);
}

var _fill = function(x00, y00, x01, y01, x02, y02, x03, y03, x10, y10, x11, y11, x12, y12, x13, y13) {
  $.moveTo(x01, y01);
  spl(x00, y00, x01, y01, x02, y02, x03, y03);
  $.lineTo(x12, y12);
  spl(x13, y13, x12, y12, x11, y11, x10, y10);
  $.closePath();
}

window.addEventListener('mousemove', function(e) {
  msX = e.pageX - l;
  msY = e.pageY - t;
}, false);

window.addEventListener('touchmove', function(e) {
  msX = e.touches[0].pageX - l;
  msY = e.touches[0].pageY - t;
}, false);

window.addEventListener('mousedown', function(e) {
  set();
}, false);

window.addEventListener('touchdown', function(e) {
  set();
}, false);

window.addEventListener('resize', function() {
  c.width = w = window.innerWidth;
  c.height = h = window.innerHeight;
  set();
}, false);

set();
run();