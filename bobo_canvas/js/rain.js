/**
 * Created by Administrator on 2015/2/27.
 */
window.onload = function indexJS(){
    var h = getWidth().ht;
    var w = getWidth().wt;

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d'), x_pos = [];

    canvas.width = w;
    canvas.height = h;
    ctx.lineCap = 'round';

    /*get display area width and height*/
    function getWidth(){
        var windowWidth = 0, windowHeight = 0;
        if(typeof(window.innerWidth) == 'number') {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
        }else{
            if(document.documentElement && document.documentElement.clientWidth) {
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
    }
    /*rain drop*/
    function drops(){
        this.x = ~~(Math.random()*w);
        this.y = 0;
        this.v = 0;
        this.t = 0;
        this.l = 0;
    }
    function addBlock(x, y, width, height){
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.fillRect(x, y, width, height);
        ctx.closePath();
        ctx.fill();
    }
    function rainDrop(drops){
        var x1 = drops.x,
            y1 = drops.y,
            x2 = drops.x+0,
            y2 = drops.y-16;

        var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, '#FFF');
        gradient.addColorStop(1, '#000');
        ctx.strokeStyle = gradient;

        //ctx.strokeStyle = '#FFF';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    function showDrops(){
        ctx.save();
        ctx.fillStyle = '#FFF';
        ctx.fillText('drops: ' + x_pos.length, 8, h - 8);
        ctx.restore();
    }
    function draw(drops){
        drops.t ++;
        drops.v += 0.1;
        drops.y = drops.t*drops.v;
        if(drops.y>(h-32)){
            drops.l += 2;
            drops.l<40?addBlock(drops.x-drops.l/2, h-35, drops.l, 1):x_pos.splice(0, 1);
        }else{
            rainDrop(drops);
        }
    }
    function render(){
        for(var i = 0;i<x_pos.length;i++){
            draw(x_pos[i]);
        }
    }

    animate();
    /*动画函数*/
    function animate(){
        ctx.clearRect(0, 0, w, h);

        if(x_pos.length<120) x_pos.push(new drops());
        render();
        showDrops();
        requestAnimationFrame(animate);/*浏览器固有定时器，其频率与自身刷新频率相同*/
    }

};