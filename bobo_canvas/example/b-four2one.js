/**
 * Created by Administrator on 2016/1/14.
 */
var c = document.getElementById('canv'),
    $ = c.getContext('2d'),
    w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    t = 0,
    num = 500,
    s, a, b,
    x, y, _x, _y,
    _t = 1 / 60;
var anim = function() {
    $.fillStyle = 'hsla(0, 0%, 90%, 1)';
    $.fillRect(0, 0, w, h);
    for (var i = 0; i < 1; i++) {
        x = 0;
        $.beginPath();
        for (var j = 0; j < num; j++) {
            x += .95 * Math.sin(16);
            y = x * Math.sin(i + 3.0 * t + x / 50) / .5;
            _x = x * Math.cos(b) - y * Math.sin(b);
            _y = x * Math.sin(b) + y * Math.cos(b);
            b = (j) * Math.PI / 1.99;
            $.lineWidth = .2;
            $.lineTo(w / 2 - _x, h / 2 - _y);
        }
        $.strokeStyle = 'hsla(0,0%,0%,1)';
        $.stroke();
    }
    t += _t;
    window.requestAnimationFrame(anim);
};
anim();
window.addEventListener('resize', function() {
    c.width = w = window.innerWidth;
    c.height = h = window.innerHeight;
}, false);