var time;
var scene;
var points;
var camera;
var canvas;
var ripples;
var context;
var renderer;
var gridSize;
var rippleEffect;
var baseOrientation;

window.onload = init;

function init() {
  // create a scene to hold objects
  scene = new THREE.Scene();

  // create a camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  controls = new THREE.TrackballControls(camera)

  camera.position.x = 15;
  camera.position.y = 16;
  camera.position.z = 13;

  camera.lookAt(scene.position);

  renderer = $("canvas");

  // add renderer to the dom

  canvas = renderer.get(0);
  context = canvas.getContext("2d");

  points = [];
  ripples = [];
  rippleEffect = 1;
  baseOrientation = 99999;
  time = new Date().getTime();
  gridSize = 4 * Math.floor(Math.max($(window).width(), $(window).height()) / 75) + 1;

  for ( var i = 0; gridSize > i; i++ ) {
      for ( var j = 0; gridSize > j; j++ ) {
        var x = i - Math.floor(gridSize / 2);
        var z = j - Math.floor(gridSize / 2);

        points[i + j * gridSize] = {
          x: x,
          y: 0,
          z: z
        }
      }
  }

  render();
}

function tick(e) {
  mouse.click && (mouse.click = !1, ripple(e))
  mouse.drag ? (camera.x += mouse.deltaX / 10, mouse.deltaX = 0) : camera.x += mouse.deltaX / 10 - spin;
  mouse.drag ? (camera.y += mouse.deltaY / 1000, mouse.deltaY = 0) : '';
  for (var t = 0; t < points.length; t++) {
      points[t].y = 0;
      for (var i = 0; i < ripples.length; i++) {
          var a = points[t].x - ripples[i].x,
              o = points[t].z - ripples[i].z;
          switch (rippleEffect) {
              case 2:
                  destPoint = Math.cos(Math.sqrt(a * a + o * o) * ripples[i].time) / (.01 * (a * a + o * o) + 1 + 3 * ripples[i].time) * -ripples[i].force;
                  break;
              case 3:
                  destPoint = Math.cos(.5 * Math.sqrt(a * a + o * o) - 100 * ripples[i].time) / (.5 * (a * a + o * o) + 1 + 3 * ripples[i].time) * -ripples[i].force;
                  break;
              default:
                  destPoint = Math.cos(.5 * Math.sqrt(a * a + o * o) - 6 * ripples[i].time) / (.5 * (a * a + o * o) + 1 + 3 * ripples[i].time) * -ripples[i].force
          }
          points[t].y += destPoint
      }
  }
  var n = (new Date).getTime(),
      r = (n - time) / 1e3;
  time = n;
  for (var t = 0; t < ripples.length; t++) ripples[t].time += r
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height), context.strokeStyle = "#EEE";

  // http://imablackstar.com/
  for (var e = [], t = 0; t < points.length; t++) {
    x = 20 * points[t].x,
    y = 20 * points[t].y,
    z = 20 * points[t].z,
    0 != x || 0 != z ? (0 == z ? (a = Math.PI / 2 * (Math.abs(x) / x), depth = 1) : (a = Math.atan(x / z), depth = Math.abs(z) / z),
    a += 2 * Math.PI,
    x = Math.sin(a + Math.PI * camera.x / 180) * Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2)) * depth,
    nz = x / Math.tan(a + Math.PI * camera.x / 180)) : nz = z,
    (0 != y || 0 != nz) && (0 == nz ? (a = Math.PI / 2 * (Math.abs(y) / y), depth = 1) : (a = Math.atan(y / nz), depth = Math.abs(nz) / nz),
    a += 2 * Math.PI, y = Math.sin(a + Math.PI * camera.y / 180) * Math.sqrt(Math.pow(y, 2) + Math.pow(nz, 2)) * depth),
    e[t] = {
      x: x + canvas.width / 2,
      y: canvas.height - (y + canvas.height / 2)
    };
  }
  context.beginPath();

  for (var t = 0; t < e.length / gridSize; t++) {
      context.moveTo(e[t].x, e[t].y);
      for (var i = 1; i < e.length / gridSize; i++) {
        context.lineTo(e[t + i * gridSize].x, e[t + i * gridSize].y)
      }
  }
  for (var t = 0; t < e.length / gridSize; t++) {
      context.moveTo(e[t * gridSize].x, e[t * gridSize].y);
      for (var i = 1; i < e.length / gridSize; i++) context.lineTo(e[i + t * gridSize].x, e[i + t * gridSize].y)
  }


  context.stroke();
  tick(e);
  requestAnimationFrame(render);
}
