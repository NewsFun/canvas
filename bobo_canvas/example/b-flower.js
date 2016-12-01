/**
 * Created by Administrator on 2016/6/12.
 */
var canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    w = window.innerWidth,
    h = window.innerHeight,
    x = ~~(w/2),
    y = ~~(h/2),
    dpr = window.devicePixelRatio,
    t = 0;

canvas.width = w;canvas.height = h;

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var numCircles = 160,
    step = 360 / numCircles,
    r = 100 * dpr,
    cr = 2 * dpr;

function render(){
    window.requestAnimFrame(render);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#333";

    for (var i = 0; i < 360; i += step) {
        var pr = r + 100 * Math.sin(i / numCircles + t / 20);
        var cx = x + pr * Math.sin(i + t / 500) - cr / 2,
            cy = y + pr * Math.cos(i + t / 500) - cr / 2;
        ctx.fillRect(cx, cy, cr, cr);
    }

    t += 1;
}
render();