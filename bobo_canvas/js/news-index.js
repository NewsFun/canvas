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
    ctx.stroke();
    ctx.restore();
}
function renderPoint(array){
    for(var i = 0;i<array.length;i++){
        drawPoint(array[i]);
    }
}
function drawPoint(point){
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2*Math.PI);
    ctx.fill();
}
function _point(x, y){
    this.x = x;
    this.y = y;
}
function _circlePoint(x, y){
    this.center = {x:half_W, y:half_H};
    this.x = x+this.center.x;
    this.y = y;
    this.dis = this.distance(this.center);
    //this.dis = 1;
    this.a = 1;
    this.b = 0.1;
    //this.clock = 0;
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
        //this.dis += 0.1;
        self.x = COS(clock*RAD)*this.dis*this.a+this.center.x;
        self.y = SIN(clock*RAD)*this.dis*this.b+this.center.y;
        //self.x -= 2*SIN((this.clock+0.5)*RAD)*SIN(0.5*RAD)*this.dis*this.a;
        //self.y += 2*COS((this.clock+0.5)*RAD)*SIN(0.5*RAD)*this.dis*this.b;
        clock +=1;
    }
};
function _movePoint(x, y){
    this.x = x;
    this.y = y;
    this.g = 0.05;
    this.r = this.distance({x:half_W,y:half_H});
    this.vx = R()*4;
    this.vy = R()*4;
}
_movePoint.prototype = {
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
        this.x += this.vx;
        this.y += this.vy;
    }
};
function createClickPoint(n){
    var start = new _point(100, half_H), end = new _point(900, half_H), list = [], num = n||5;
    var deltaX = end.x-start.x,
        deltaY = end.y-start.y,
        stepX = deltaX/(num-1),
        stepY = deltaY/(num-1);
    for(var i = 0;i<num;i++){
        var x = start.x+stepX*i, y = start.y+stepY*i;
        list.push(new _movePoint(x, y));
    }
    return list;
}
function createCrossPoint(array){
    var list = [];
    for(var i = 0;i<array.length;i++){
        var j = (i+1)%array.length;
        var x = (array[i].x + array[j].x)/2;
        list.push(new _movePoint(x, ~~(R()*1.5*H)));
    }
    return list;
}
function drawLine(pointList, crossList){
    for(var i = 0;i<pointList.length;i++){
        var j = (i+1)%pointList.length;
        drawCurve(pointList[i], crossList[i], pointList[j]);
    }
}
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
function update(clickPoint, crossPoint, clickEnd, crossEnd){
    for(var i = 0;i<clickPoint.length;i++){
        clickPoint[i].moveTo(clickEnd[i]);
        crossPoint[i].moveTo(crossEnd[i]);
        drawPoint(clickPoint[i]);
        //drawPoint(crossPoint[i]);
        drawLine(clickPoint, crossPoint);
    }
}

var click_point = createClickPoint();
var cross_point = createCrossPoint(click_point);
var sr = 200, lr = sr/COS(36*RAD);
var ep = endPoint(W/2,H/2, sr, lr, 0);
var cross_end = ep.innerPoint, click_end = ep.outerPoint;

/*test point*/
var testpoint = new _circlePoint(500, 500);
function animate(){
    ctx.clearRect(0, 0, W, H);
    //update(click_point, cross_point, click_end, cross_end);
    testpoint.move();
    drawPoint(testpoint);
    requestAnimationFrame(animate);
}
initCanvas();
animate();
//EllipseTwo(ctx, W/2, H/2, 200, 150);