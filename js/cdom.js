(function(window){
    const W = window.innerWidth, H = window.innerHeight;
    const canvas = document.querySelector("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const R = Math.random, SIN = Math.sin, COS = Math.cos, PI = Math.PI;
    class Elf{
        constructor(param){
            this.shape = param.shape||'square';
            this.r = 20;
            this.color = 'rgba(255,255,255,1)';
        }
        render(){
            this.draw();
        }
        draw(){
            this.shape==='circle'?this.drawCircle():this.drawSquare();
        }
        drawCircle(){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.r, this.r, this.r, 0, 2*PI, true);
            ctx.fill();
        }
        drawSquare(){
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, this.r, this.r);
            ctx.fill();
        }
    }
    var ef = new Elf({shape:'circle'});
    ef.render();
})(window);