/**
 * Created by Administrator on 2016/6/12.
 */
//var canvas = document.getElementById('canvas');
var canvas = setCanvas();
var cx = canvas.getContext('2d');
cx.lineCap = 'round';

var drops_bg = []; // background rain drops
var drops_mg = []; // midground rain drops
var drops_fg = []; // foreground rain drops

var frames = 0;
var fps = 0;
var lastDraw = new Date();

function start() {
    generateDrops(drops_bg, 1000/120);
    generateDrops(drops_mg, 1000/60);
    generateDrops(drops_fg, 1000/120);
    setInterval(draw, 1000/60);
}

// adds a new raindrop to the specified array every time the interval expires
function generateDrops(drops, interval) {
    setInterval(function() {
        drops[drops.length] = { x: Math.random() * (canvas.width + (canvas.height / 2)), y : -50 };
    }, interval);
}

// draws a single frame
function draw() {
    var now = new Date();
    var diff = Math.ceil((now.getTime() - lastDraw.getTime()));
    if (diff >= 1000) {
        fps = frames;
        frames = 0;
        lastDraw = now;
    }
    cx.fillStyle = '#F9F9FF';
    cx.fillRect(0, 0, canvas.width, canvas.height);
    drawDrops(drops_bg, 0.5, 15, 1.5);
    drawDrops(drops_mg, 1.0, 20, 2);
    drawDrops(drops_fg, 1.5, 25, 3);
    drawFps();
    frames++;
}

// draws the raindrops for a specific layer for a single frame
function drawDrops(drops, width, height, delta) {
    cx.lineWidth = width;
    for(var i = 0; i < drops.length; i++) {

        var drop = drops[i];
        var x1 = drop.x, y1 = drop.y, x2 = drop.x - height, y2 = drop.y + (height * 2);

        var gradient = cx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, '#EEF');
        gradient.addColorStop(1, '#AAD');
        cx.strokeStyle = gradient;

        cx.beginPath();
        cx.moveTo(x1, y1);
        cx.lineTo(x2, y2);
        cx.stroke();

        drop.x -= delta;
        drop.y += delta * 2;

        if(drop.x < 0 && drop.y > canvas.height) {
            drops.splice(i, 1);
            i--;
        }
    }
}

// draws the FPS counter; not strictly accurate, but there's no standard alternative: http://robert.ocallahan.org/2010/11/measuring-fps_26.html
function drawFps() {
    cx.save();
    cx.fillStyle = '#999';
    cx.fillText('FPS: ' + fps, 4, canvas.height - 4);
    cx.restore();
}

start();