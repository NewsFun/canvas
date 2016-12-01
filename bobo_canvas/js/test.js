var canvas = setCanvas();
var ctx = canvas.getContext('2d');
var W = window.innerWidth, H = window.innerHeight, DEG_TO_RAD = Math.PI/180;
var surface = ~~(H/2), bold = 6, scale = 2, xx = ~~(W/(2*scale));
var range = [], water = [], diff = 1000, dd = 15;

function initWater(){
    for(var i = 0;i<=W;i+=scale){
        range.push({
            x:i,
            y:0/*+Math.sin(i*DEG_TO_RAD)*30*/
        })
    }
}
function drawLine(points){
    ctx.strokeStyle = 'white';
    ctx.lineWidth = bold;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for(var i = 1;i<points.length;i++){
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}
canvas.onmousedown = function(e){
    var mx, my;
    if(e){
        mx = e.pageX;
        my = e.pageY;
    }

    if(Math.abs(surface-my)<20){
        var i = ~~(mx/scale);
        range[i].y = diff;
    }
};
function update(){
    /*
    for(var i = 0;i<range.length;i++){
        water[i] = code(range[i]);
    }
    */
    diff *= 0.1;
    range[xx] = diff;
    for(var i=xx-1;i>0;i--) {
        var d = xx-i;
        if(d > dd) d=dd;
        range[i] -= (range[i]-range[i+1])*(1-0.01*d);
    }
    //右侧
    for(var i=xx+1;i<range.length;i++) {
        var d = i-xx;
        if(d > dd)d=dd;
        range[i] -= (range[i]-range[i-1])*(1-0.01*d);
    }

    //更新点Y坐标
    for(var i = 0;i < water.length;i++){
        water[i].updateY(range[i]);
    }
    drawLine(water);
}
function code(point){
    this.baseY = surface;
    this.x = point.x;
    this.y = point.y;
    this.vy = 0;
    this.targetY = 0;
}
code.prototype.updateY = function(point){
    this.targetY = point.y + this.baseY;
    this.vy += this.targetY - this.y;
    this.y += this.vy;
};
function animate(){
    ctx.clearRect(0, 0, W, H);
    update();
    requestAnimationFrame(animate);
}
initWater();
update();
//animate();