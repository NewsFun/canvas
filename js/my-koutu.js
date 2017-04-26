/**
 * Created by bobo on 2017/4/21.
 */
(function(window){
    var canvas = window.document.querySelector('#dolly');
    var img = new Image();
    img.src = '../img/1.jpg';
    var w = img.width, h = img.height;
    var ctx = canvas.getContext('2d');
    var imgData = [], rgba = {}, react = {}, edge = {}, _ant = {};
    function Ant(param){
        this.addr = {
            x:param.x,
            y:param.y
        };
        this.head = param.head||0;
    }
    Ant.prototype = {
        constructor:Ant,
        _pos:function(dx, dy){
            var self = this;
            return new Ant({
                x:self.addr.x+dx,
                y:self.addr.y+dy,
                head:self.head
            });
        }
    };
    function initPage(){
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0, 0, w, h).data;
        //_showCenterPoint();
        addEvent('click');
    }
    function addEvent(ev){
        var left = canvas.offsetLeft, top = canvas.offsetTop;
        canvas['on'+ev] = function(event){
            var e = event||window.event;
            var rx = e.clientX-left, ry = e.clientY-top;
            //_showCenterPoint(rx, ry);
            //var rgba0 = getRGBA(0, 0);
            rgba = getRGBA(rx, ry);
            react = {maxx:rx, minx:rx, maxy:ry, miny:ry};
            _ant = new Ant({x:rx, y:ry});
            edgeDetection();
            //var d = aberration(rgba0, rgba);
            //console.log(rgba, d);
        }
    }
    function edgeDetection(ant){
        switch (ant.head){
            case 0:
                if(edge[ant.addr.toString()]){
                    ant = ant._pos(0, 1);
                }else{

                }
                break;

        }
        var d = aberration();
    }
    function batchDiff(array){
        for(var i = 0; i<array.length;i++){
            var ab = aberration();
        }
    }
    function aberration(point1, point2){
        var dr = point1.r-point2.r,
            dg = point1.g-point2.g,
            db = point1.b-point2.b;
        return Math.sqrt(dr*dr*3+dg*dg*4+db*db*2);
    }
    function getRGBA(x, y){
        var index = (x+y*w)*4;
        var r = imgData[index],
            g = imgData[index+1],
            b = imgData[index+2],
            a = imgData[index+3];
        return {r:r, g:g, b:b, a:a}
    }
    function _showCenterPoint(x, y){
        drawRectangle({
            fillColor:'#00ff00',
            //fillColor:'rgba(255,255,255,1)',
            origin:{x:x, y:y},
            size:{w:1, h:1}
        });
    }
    function drawRectangle(path){
        //ctx.moveTo(config.origin.x, config.origin.y);
        ctx.save();
        ctx.fillStyle = path.fillColor;
        ctx.fillRect(path.origin.x, path.origin.y, path.size.w, path.size.h);
        ctx.restore();
        return path;
    }
    img.onload = initPage;
})(window);