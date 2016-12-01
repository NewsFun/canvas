/**
 * Created by Administrator on 2016/4/22.
 */
    "use strict";
var canvas = setCanvas();
var ctx = canvas.getContext('2d');
var W = canvas.width, H = canvas.height, coord = [], num_x = 0, num_y = 0, scale = 20, edg_x = 0, edg_y = 0, ax;

function Point(args){
    this.x = args.x;
    this.y = args.y;
    this.r = args.r||1;
    this.c = args.c || 'rgba(255,255,255,0.5)';
    this.tick = false;
}
function setPoint(num, ball){
    switch (num){
        case 0:
            ball.r = 5;
            ball.c = 'rgba(255, 0, 0, 1)';
            ball.tick = true;
            break;
        case 1:
            ball.r = 5;
            ball.c = 'rgba(0, 255, 0, 1)';
            ball.tick = true;
            break;
        case 2:
            ball.r = 5;
            ball.c = 'rgba(0, 0, 255, 1)';
            ball.tick = true;
            break;
        default :
            ball.r = 1;
            ball.c = 'rgba(255, 255, 255, 0.5)';
            ball.tick = false;
            break;
    }
}
function mousePos(ev){
    var mouseX, mouseY;//获取鼠标位置
    if(ev){
        mouseX = ev.pageX;
        mouseY = ev.pageY;
    }else{
        mouseX = event.x + document.body.scrollLeft;
        mouseY = event.y + document.body.scrollTop;
    }
    return {mx:mouseX, my:mouseY}
}
function config(con){
    var conf = {};
    if(con.scale){
        scale = con.scale||scale;
        num_x = Math.floor(W/scale);
        num_y = Math.floor(H/scale);
        edg_x = Math.floor((W-num_x*scale)/2);
        edg_y = Math.floor((H-num_y*scale)/2);
        conf = {
            scale : scale,
            nx : num_x,
            ny : num_y,
            sx : edg_x,
            sy : edg_y
        }
    }else{
        conf ={
            nx : Math.round(con.x/scale),
            ny : Math.round(con.y/scale)
        }
    }
    return conf;
}
function gridSys(){
    //console.log(num_x, num_y);
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    for(var x = 0;x<=num_x;x++){
        ctx.moveTo(coord[x][0].x, coord[x][0].y);
        ctx.lineTo(coord[x][num_y].x, coord[x][num_y].y);
    }
    for(var y = 0;y<=num_y;y++){
        ctx.moveTo(coord[0][y].x, coord[0][y].y);
        ctx.lineTo(coord[num_x][y].x, coord[num_x][y].y);
    }
    ctx.stroke();
    ctx.restore();
}
function pointSys(all){
    var show = all||false;
    //console.log(show);
    ctx.save();
    for(var cx = 0;cx<=num_x;cx++){
        for(var cy = 0;cy<=num_y;cy++){
            if(show){
                drawBall(coord[cx][cy]);
            }else{
                if(coord[cx][cy].tick) drawBall(coord[cx][cy]);
            }
        }
    }
    ctx.restore();
}
function initCoordinate(){
    var con = config({scale:40});

    for(var cx = 0;cx<=num_x;cx++){
        var xx = [];
        for(var cy = 0;cy<=num_y;cy++){
            xx.push(new Point({
                x:edg_x+cx*con.scale,
                y:edg_y+cy*con.scale
            }));
        }
        coord.push(xx);
    }
}
function setOrigin(x, y){
    return {x: x, y: y}
}
function drawBall(ball){
    ctx.beginPath();
    ctx.fillStyle = ball.c;
    ctx.arc(ball.x, ball.y, ball.r, 0, 2*Math.PI, true);
    ctx.fill();
}
function init(){
    initCoordinate();
    //console.log(coord);
    //gridSys();
    pointSys(true);
}
function redraw(){
    ctx.clearRect(0, 0, W, H);
    init();
}
function sine(args){
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 255, 0, 1)';
    ctx.moveTo(args.x, args.y);
    for(var i = 0; i < args.l; i += args.s){
        var cx = i * 20;
        var cy = Math.sin(i) * 40;
        ctx.lineTo(args.x+cx, args.y+cy);
    }
    ctx.stroke();
    ctx.restore();
}
function trans() {
    var sin = Math.sin(Math.PI/6);
    var cos = Math.cos(Math.PI/6);
    ctx.translate(200, 200);
    var c = 0;
    for (var i=0; i <= 12; i++) {
        c = Math.floor(255 / 12 * i);
        ctx.fillStyle = "rgb(" + c + "," + c + "," + c + ")";
        ctx.fillRect(0, 0, 100, 10);
        ctx.transform(cos, sin, -sin, cos, 0, 0);
    }

    ctx.setTransform(-1, 0, 0, 1, 200, 200);
    ctx.fillStyle = "rgba(255, 128, 255, 0.5)";
    ctx.fillRect(0, 50, 100, 100);
}
//init();
/*
sine({
    x:W/4,
    y:H/2,
    l:20*3.1416,
    s:0.1
});
*/
trans();
canvas.onclick = function(ev){
    var pos = mousePos(ev);
    //console.log(pos.mx, pos.my);
    var con = config({
        x:pos.mx,
        y:pos.my
    });
    var ball = coord[con.nx][con.ny];
    if(ball.tick){
        setPoint(12, ball);
        redraw();
    }else{
        setPoint(1, ball);
        drawBall(ball);
    }
    //console.log(coord[con.nx][con.ny]);
};