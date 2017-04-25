/**
 * Created by bobo on 2017/2/7.
 */
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var W = window.innerWidth,
    H = window.innerHeight,
    half_W = W/2, half_H = H/2, clock = 0,
    R = Math.random,
    MAX = Math.max,
    MIN = Math.min,
    SIN = Math.sin,
    COS = Math.cos,
    RAD = Math.PI/180;
//var ys = randomY(5);
//var ys = [0,1000,500,-1000,2000];
var ys = 0;
function initCanvas(){
    canvas.width = W; canvas.height = H;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 1;
}
function EllipseTwo(context, x, y, a, b) {
    context.save();
    var r = (a > b) ? a : b;
    var ratioX = a / r;
    var ratioY = b / r;
    context.scale(ratioX, ratioY);
    context.beginPath();
    context.arc(x / ratioX, y / ratioY, r, 0, 2*Math.PI, false);
    context.closePath();
    context.restore();
    //context.fill();
    context.stroke();
}

function drawCurve(start, cross, end){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(start.x,start.y);
    ctx.quadraticCurveTo(cross.x, cross.y, end.x, end.y);
    ctx.restore();
    ctx.stroke();
}
function renderPoint(array){
    for(var i = 0;i<array.length;i++){
        drawPoint(array[i]);
    }
}
function drawPoint(point){
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, 2*Math.PI);
    ctx.fill();
}
function _point(x, y){
    this.x = x;
    this.y = y;
}
function _circlePoint(rot){
    this.center = {x:half_W, y:half_H};
    this.rot = rot;
    this.dis = 400;
    this.a = 3;
    this.b = 0.2;
    //this.rad = 0;
    this.x = COS((clock-rot)*RAD)*this.dis*this.a+this.center.x;
    this.y = SIN((clock-rot)*RAD)*this.dis*this.b+this.center.y;
}
_circlePoint.prototype = {
    moveTo:function(point){
        var self = this;
        var dis = self.distance(point, true);
        var d = dis[2], dx = dis[0], dy = dis[1];
        if(d>1){
            this.x -= dx*this.g;
            this.y -= dy*this.g;
        }
    },
    distance:function(n, details){
        var dx = this.x - n.x,
            dy = this.y - n.y,
            d = Math.sqrt(dx * dx + dy * dy);

        return details ? [dx, dy, d] : d;
    },
    move:function(){
        var self = this;
        self.x = COS((clock*6-self.rot)*RAD)*this.dis*this.a+this.center.x;
        self.y = SIN((clock*6-self.rot)*RAD)*this.dis*this.b+this.center.y;
        self.b = SIN(clock*RAD)/4;
        if(self.a>1) self.a *= 0.985;
    }
};
function endPoint(x, y, r, R, rot){
    var list_s = [], list_l = [];
    for(var i = 0;i<5;i++){
        list_s.push(new _point(COS((i*72-rot+54)*RAD)*R+x, -SIN((i*72-rot+54)*RAD)*R+y));
        list_l.push(new _point(COS((i*72-rot+18)*RAD)*r+x, -SIN((i*72-rot+18)*RAD)*r+y));
    }
    return {
        outerPoint:list_l,
        innerPoint:list_s
    }
}
function drawLine(pointList, crossList){
    for(var i = 0;i<pointList.length;i++){
        var j = (i+1)%pointList.length;
        drawCurve(pointList[i], crossList[i], pointList[j]);
    }
}
function createCrossPoint(array){
    /*var y = ys[0];*/
    var list = [], y = [];
    for(var i = 0;i<array.length;i++){
        var j = (i+1)%array.length;
        var x = (array[j].x-array[i].x)*R()+array[i].x;
        //var p = new _point(x, y);
        y =
        list.push(new _point(x, ys[i]));
    }
    return list;
}
function randomY(n){
    var list = [];
    for(var i = 0;i<n;i++){
        list.push(~~(R()*2*H));
    }
    return list;
}
function createClickPoint(n){
    var num = n|| 5, rad = ~~(360/num), list = [];
    for(var i = 0;i<num;i++){
        list.push(new _circlePoint(rad*i));
    }
    return list;
}
function update(clickPoint){
    for(var i = 0;i<clickPoint.length;i++){
        clickPoint[i].move();
        ys[i] -= (ys[i]-half_H)*0.02;
    }
    var cross = createCrossPoint(clickPoint);
    drawLine(clickPoint, cross);
    renderPoint(clickPoint);
}
/*test point*/
var testlist = createClickPoint();
var endpoint = endPoint(half_W, half_H);
function animate(){
    ctx.clearRect(0, 0, W, H);
    //update(click_point, cross_point, click_end, cross_end);
    //testpoint.move();
    //drawPoint(testpoint);
    //renderPoint(testlist);
    update(testlist);
    clock++;
    if(clock<100)requestAnimationFrame(animate);
}
initCanvas();
animate();