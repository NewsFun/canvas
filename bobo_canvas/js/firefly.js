/**
 * Created by Administrator on 2015/12/29.
 */
"use strict";
window.onload = function Firefly(){
    var canvas = setCanvas();
    var ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'lighter';
    var W = canvas.width, H = canvas.height;
    var base = {
        mousePos:function(ev){
            var mouseX, mouseY;//获取鼠标位置
            if (ev) {
                mouseX = ev.pageX;
                mouseY = ev.pageY;
            }else{
                mouseX = event.x + document.body.scrollLeft;
                mouseY = event.y + document.body.scrollTop;
            }
            return {mx:mouseX, my:mouseY}
        }
    };
    var Style = {
        randomColor:function (){
            return 'rgb('+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+','+parseInt(Math.random()*255)+')';
        },
        radial:function(ball, hue){
            var rg = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
            rg.addColorStop(0.05, '#fff');
            rg.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
            rg.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
            rg.addColorStop(1, 'transparent');
            return rg;
        }
    };
    var Animate = {
        bounce:function (self){
            self.x += self.vx;
            self.y += self.vy;
            if(self.x - self.radius <= 0){
                self.vx = -self.vx;
                self.x = self.radius;
            }
            if(self.x + self.radius >= W){
                self.vx = -self.vx;
                self.x = W-self.radius;
            }
            if(self.y - self.radius <= 0){
                self.vy = -self.vy;
                self.y = self.radius;
            }
            if(self.y + self.radius >= H){
                self.vy = -self.vy;
                self.y = H-self.radius;
            }
        }
    };

    var ball = function(){
        this.x = parseInt(Math.random()*W);
        this.y = parseInt(Math.random()*H);
        this.vx = (Math.random()-0.5)*4;
        this.vy = (Math.random()-0.5)*4;
        //this.color = Style.randomColor().toString();
        this.color = Math.floor(Math.random()*360);
        this.radius = parseInt(Math.random()*20+4);
    };
    var balls = createBalls(200);

    function animate(){
        ctx.clearRect(0, 0, W, H);
        redraw();
        requestAnimationFrame(animate);
    }
    function redraw(){
        for(var i=0;i<balls.length;i++){
            drawBalls(balls[i]);
        }
    }
    function drawBalls(ball){
        Animate.bounce(ball);
        ctx.beginPath();
        ctx.fillStyle = Style.radial(ball, ball.color);
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
        ctx.fill();
    }
    function createBalls(n){
        n = n||10;
        var b = [];
        for(var i = 0;i<n;i++){
            b.push(new ball());
        }
        return b;
    }

    animate();
};