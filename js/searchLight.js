/**
 * Created by Administrator on 2015/5/22.
 */
window.onload = function drawingJS(){
    var canvas = setCanvas();
    var ctx = canvas.getContext('2d');
    var searchLight = {x:100, y:100,vx:5, vy:5,radius:10};
    function mousePosition(ev){
        var mouseX, mouseY;//获取鼠标位置
        if (ev) {
            mouseX = ev.pageX;
            mouseY = ev.pageY;
        }else{
            mouseX = event.x + document.body.scrollLeft;
            mouseY = event.y + document.body.scrollTop;
        }
        return {mx:mouseX,my:mouseY};
    }
    function drawStar(r, R, x, y, rot){
        rot = rot||0;
        ctx.beginPath();
        for(var i = 0;i<5;i++){
            ctx.lineTo(Math.cos((18+i*72-rot)/180*Math.PI)*R+x, -Math.sin((18+i*72-rot)/180*Math.PI)*R+y);
            ctx.lineTo(Math.cos((54+i*72-rot)/180*Math.PI)*r+x, -Math.sin((54+i*72-rot)/180*Math.PI)*r+y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    function searchlight(mx, my){
        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, 100, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.clip();

        shadowSet();
        addWords();
        ctx.restore();
    }
    function addWords(){
        ctx.font = 'bold 150px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#058';
        ctx.fillText('\u795d\u4f60\u751f\u65e5\u5feb\u4e50', canvas.width/2, canvas.height/2);
    }
    function animate(){

        requestAnimationFrame(animate);
    }
    function shadowSet(){
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'black';
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
    }
    function update(canvasWidth, canvasHeight){
        searchLight.x += searchLight.vx;
        searchLight.y += searchLight.vy;
        if(searchLight.x - searchLight.radius <= 0){
            searchLight.vx = -searchLight.vx;
            searchLight.x = searchLight.radius;
        }
        if(searchLight.x + searchLight.radius >= canvasWidth){
            searchLight.vx = -searchLight.vx;
            searchLight.x = canvasWidth-searchLight.radius;
        }
        if(searchLight.y - searchLight.radius <= 0){
            searchLight.vy = -searchLight.vy;
            searchLight.y = searchLight.radius;
        }
        if(searchLight.y + searchLight.radius >= canvasHeight){
            searchLight.vy = -searchLight.vy;
            searchLight.y = canvasHeight-searchLight.radius;
        }
    }
    canvas.onmousemove = function mv(e){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var mp = mousePosition(e);
        searchlight(mp.mx, mp.my);
    }

};