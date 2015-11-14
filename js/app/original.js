function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height), context.strokeStyle = "#EEE";

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

    camera.y -= -0.1;

    context.stroke();
    tick(e);
    requestAnimationFrame(draw)
}

function tick(e) {
    mouse.click && (mouse.click = !1, ripple(e))
    mouse.drag ? (camera.x += mouse.deltaX / 10, mouse.deltaX = 0) : camera.x += mouse.deltaX / 10 - spin;
    // mouse.drag ? (camera.y += mouse.deltaY / 100, mouse.deltaY = 0) : '';
    for (var t = 0; t < points.length; t++) {
        points[t].y = 0;
        for (var i = 0; i < ripples.length; i++) {
            var a = points[t].x - ripples[i].x,
                o = points[t].z - ripples[i].z;
            switch (rippleEffect) {
                case 2:
                    destPoint = Math.cos(.5 * Math.sqrt(a * a + o * o) - 100 * ripples[i].time) / (.5 * (a * a + o * o) + 1 + 3 * ripples[i].time) * -ripples[i].force;
                    break;
                case 3:
                    destPoint = Math.cos(.5 * Math.sqrt(a * a + o * o) - 6 * ripples[i].time) / (.5 * (a * a + o * o) + 1 + 3 * ripples[i].time) * -ripples[i].force
                    break;
                default:
                    destPoint = Math.cos(Math.sqrt(a * a + o * o) * ripples[i].time) / (.01 * (a * a + o * o) + 1 + 3 * ripples[i].time) * -ripples[i].force;
            }
            points[t].y += destPoint
        }
    }
    var n = (new Date).getTime(),
        r = (n - time) / 1e3;
    time = n;
    for (var t = 0; t < ripples.length; t++) ripples[t].time += r
}

function ripple(e) {
    for (var t, i = -1, a = 0; a < e.length; a++) {
        var o = Math.sqrt(Math.pow(e[a].x - mouse.x, 2) + Math.pow(e[a].y - mouse.y, 2));
        (-1 == i || i > o) && (i = o, t = a)
    }
    ripples.push({
        x: points[t].x,
        y: points[t].y,
        z: points[t].z,
        time: 0,
        force: 5
    })
}

for (var canvas = $("canvas").get(0), context = canvas.getContext("2d"), gridSize = 6 * Math.floor(Math.max($(window).width(), $(window).height()) / 100) + 1, points = [], ripples = [], camera = {
        x: 0,
        y: 0
    }, spin = 0, mouse = {
        x: 0,
        y: 0,
        deltaY: 0,
        deltaX: 0,
        click: !1,
        drag: !1
    }, time = (new Date).getTime(), baseOrientation = 99999, rippleEffect = 1, time = (new Date).getTime(), i = 0; gridSize > i; i++)
    for (var j = 0; gridSize > j; j++) {
        var x = i - Math.floor(gridSize / 2),
            z = j - Math.floor(gridSize / 2);
        points[i + j * gridSize] = {
            x: x,
            y: 0,
            z: z
        }
    }

draw(),

setTimeout(function() {
    $("canvas").fadeIn(1e3);
}, 500),

$(window).keydown(function(e) {
    (37 == e.keyCode || 39 == e.keyCode) && (spin = e.keyCode - 38)
});

$(window).keyup(function(e) {
    switch (e.keyCode) {
        case 37:
        case 39:
            spin = 0;
            break;
        case 49:
        case 50:
        case 51:
            rippleEffect = e.keyCode - 48
    }
}), $(window).on("mousedown touchstart", function(e) {
    mouse.click = !0, mouse.drag = !0, "undefined" != typeof e.pageX ? (mouse.x = e.pageX, mouse.y = e.pageY) : void 0 !== typeof e.originalEvent && (mouse.x = e.originalEvent.pageX, mouse.y = e.originalEvent.pageY, rippleEffect = e.originalEvent.touches.length)
}), $(window).on("mousemove", function(e) {
    mouse.drag && (mouse.deltaY += mouse.y - e.pageY)
    // mouse.drag && (mouse.deltaX += mouse.x - e.pageX), "undefined" != typeof e.pageX ? (mouse.x = e.pageX, mouse.y = e.pageY) : void 0 !== typeof e.originalEvent && (mouse.x = e.originalEvent.pageX, mouse.y = e.originalEvent.pageY, event.preventDefault())
}), $(window).on("mouseup touchend", function() {
    mouse.click = !1, mouse.drag = !1
}), $(window).on("deviceorientation", function(e) {
    99999 == baseOrientation && (baseOrientation = e.originalEvent.alpha + camera.x), camera.x = e.originalEvent.alpha - baseOrientation
}), $(window).resize(function() {
    canvas.width = $(window).width(), canvas.height = $(window).height()
}).resize();
