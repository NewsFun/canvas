/**
 * Created by bobo on 2017/2/7.
 */
var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');
var W = window.innerWidth, H = window.innerHeight, MAX = Math.max, MIN = Math.min, R = Math.random;
//var halfP={}, spNowCountResio;
    canvas.width = W; canvas.height = H;
    ctx.strokeStyle = 'white';
/*
var geometry={
    getR:function(p1,p2){
        //var inclination=-(p2.y-p1.y)/(p2.x-p1.x);
        return -(p2.y-p1.y)/(p2.x-p1.x);
    },
    line:function(p1,inc){
        this.prototype=Object;
        this.a=inc;
        this.b=p1.y-this.a*p1.x;
        this.x=p1.x;
        this.y=p1.y;
    },

    getCrossPoint:function(line1,line2){
        var px,py;
        var a1=line1.a;
        var b1=line1.b;
        var a2=line2.a;
        var b2=line2.b;


        if(a1-a2==0){
            px=line1.x+(line2.x-line1.x)/2;
            py=line1.y+(line2.y-line1.y)/2;
        }else if(Math.abs(a1)==Infinity){

            px=line2.x;
            py=a2.x+b2;
        }else if(Math.abs(a2)==Infinity){

            px=line1.x;
            py=a1.x+b1;
        }else{
            px=-(b1-b2)/(a1-a2);
            py=a1*px+b1;
        }

        return {x:px,y:py}

    }
};

var drawPointerLine=function(np,lp){
    var Rresio=0;

    var inclination1=1/geometry.getR(halfP,np);
    var inclination2=1/geometry.getR(halfP,lp);
    var line1=new geometry.line(np,inclination1);
    var line2=new geometry.line(lp,inclination2);
    var crossP0=geometry.getCrossPoint(line1,line2);
    */
/*console.log("spNowCountResio="+spNowCountResio)*//*

    if(spNowCountResio>0.5){
        this.adjustCount=(1-spNowCountResio)/0.5;
        Rresio=Math.sin(this.adjustCount*Math.PI);
    }
    var adjust1=0.96;
    this.adjust1=adjust1+Rresio*0.05;
    var tpX=(crossP0.x-halfP.x)*this.adjust1;
    var tpY=(crossP0.y-halfP.y)*this.adjust1;
    var crossP={x:halfP.x+tpX,y:halfP.y+tpY}

    var adjust2=1.01;
    var npX=halfP.x+(np.x-halfP.x)*adjust2;
    var npY=halfP.y+(np.y-halfP.y)*adjust2;
    var lpX=halfP.x+(lp.x-halfP.x)*adjust2;
    var lpY=halfP.y+(lp.y-halfP.y)*adjust2;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.moveTo(npX,npY);
    ctx.quadraticCurveTo(crossP.x,crossP.y,lpX,lpY);
    ctx.stroke();
    ctx.restore();
};
*/

function drawCurve(start, cross, end){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(start.x,start.y);
    ctx.quadraticCurveTo(cross.x, cross.y, end.x, end.y);
    ctx.stroke();
    ctx.restore();
}
function _point(x, y){
    this.x = x;
    this.y = y;
}
function _movePoint(x, y){
    this.x = x;
    this.y = y;
    this.g = 0.05;
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
        }else{
            this.x -= Math.sin(R() * 3.142);
            this.y -= Math.sin(R() * 3.142);
        }
    },
    distance:function(n, details){
        var dx = this.x - n.x,
            dy = this.y - n.y,
            d = Math.sqrt(dx * dx + dy * dy);

        return details ? [dx, dy, d] : d;
    }
};
function createClickPoint(n){
    var start = new _point(100, ~~(H/2)), end = new _point(900, ~~(H/2)), list = [], num = n||5;
    var deltaX = end.x-start.x, deltaY = end.y-start.y, stepX = deltaX/(num-1), stepY = deltaY/(num-1);
    for(var i = 0;i<num;i++){
        var x = start.x+stepX*i, y = start.y+stepY*i;
        list.push(new _movePoint(x, y));
    }
    //console.log(list);
    return list;
}
function createCrossPoint(array){
    var list = [];
    for(var i = 0;i<array.length;i++){
        var j = (i+1)%array.length;
        var x = ~~(array[i].x + array[j].x)/2;
        list.push(new _movePoint(x, ~~(R()*H)));
    }
    return list;
}
function drawLine(pointList, crossList){
    for(var i = 0;i<pointList.length;i++){
        var j = (i+1)%pointList.length;
        drawCurve(pointList[i], crossList[i], pointList[j]);
    }
}
var ps = createClickPoint(6);
var cps = createCrossPoint(ps);
//console.log(cps);
//drawCurve();
drawLine(ps, cps);