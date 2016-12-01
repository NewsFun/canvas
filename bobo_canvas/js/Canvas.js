/**
 * Created by Administrator on 2015/12/28.
 */
(function(){
    var ready = {
        getWindow:function(){
            var windowWidth = 0, windowHeight = 0;
            if(typeof(window.innerWidth) == 'number'){
                windowWidth = window.innerWidth;
                windowHeight = window.innerHeight;
            }else{
                if(document.documentElement && document.documentElement.clientWidth){
                    windowWidth = document.documentElement.clientWidth;
                    windowHeight = document.documentElement.clientHeight;
                }else{
                    if (document.body && document.body.clientWidth){
                        windowWidth = document.body.clientWidth;
                        windowHeight = document.body.clientHeight;
                    }
                }
            }

            return { wt:windowWidth, ht:windowHeight };
        },
        setCanvas:function(){
            var self = this;
            var canvas = document.getElementById('myCanvas');

            canvas.setAttribute('width', self.getWindow().wt+'px');
            canvas.setAttribute('height', self.getWindow().wt+'px');

            console.log('\u0031\u0032\u0030\u0033\u51fa\u54c1');
            return canvas;
        },
        mousePosition:function(ev){
            var mouseX, mouseY;//获取鼠标位置
            if (ev) {
                mouseX = ev.pageX;
                mouseY = ev.pageY;
            }else{
                mouseX = event.x + document.body.scrollLeft;
                mouseY = event.y + document.body.scrollTop;
            }
            return {mx:mouseX,my:mouseY}
        }
    };
    var ctx = ready.setCanvas().getContext('2d');
    ctx.prototype = {
        drawLine:function(sx, sy, ex, ey){
            this.moveTo(sx, sy);
            this.lineTo(ex, ey);
        }
    };
    var worm = function(x, y, vx, vy, radius){
        this.x = x;
        this.y = y;
        this.vx = vx || 0;
        this.vy = vy || 0;
        this.r = radius;
    };
    worm.prototype = {
        bounce:function(canvasWidth, canvasHeight){
            var self = this;
            //console.log(self);
            self.x += self.vx;
            self.y += self.vy;
            if(self.x - self.r <= 0){
                self.vx = -self.vx;
                self.x = self.r;
            }
            if(self.x + self.r >= canvasWidth){
                self.vx = -self.vx;
                self.x = canvasWidth-self.r;
            }
            if(self.y - self.r <= 0){
                self.vy = -self.vy;
                self.y = self.r;
            }
            if(self.y + self.r >= canvasHeight){
                self.vy = -self.vy;
                self.y = canvasHeight-self.r;
            }
        }
    };
    window.worm = worm;
    window.ready = ready;
    window.ctx = ctx;
})();
