/**
 * Created by bobo on 2017/4/21.
 */
(function(window){
    var canvas = window.document.querySelector('#dolly');
    var img = new Image();
    img.src = '../img/5.jpg';
    var w = img.width, h = img.height;
    var ctx = canvas.getContext('2d');
    var imgData = [], _ts = 80, react = {}, edge = {}, _ant = {}, _head = null, n = 0, finish = false;
    var ahead, ab;

    function Ant(param){
        this.addr = {
            x:param.x,
            y:param.y
        };
        this.color = getRGBA(this.addr);
        this.head = param.head||0;
    }
    Ant.prototype = {
        constructor:Ant,
        _pos:function(dx, dy){
            return new Ant({
                x:this.addr.x+dx,
                y:this.addr.y+dy,
                head:this.head
            });
        }
    };
    function initPage(){
        w = img.width;
        h = img.height;
        canvas.width = w;
        canvas.height = h;
        console.log(w, h);
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0, 0, w, h).data;
        addEvent('click');
    }
    function addEvent(ev){
        var left = canvas.offsetLeft, top = canvas.offsetTop;
        canvas['on'+ev] = function(event){
            var e = event||window.event;
            var rx = e.clientX-left, ry = e.clientY-top;
            _ant = new Ant({x:rx, y:ry});
            finish?initConfig():dropDown(_ant);
        }
    }
    function initConfig(){
        n = 0;
        edge = {};
        _head = null;
        finish = false;
        dropDown(_ant);
    }
    function edgePoint(point){
        point.x = Math.min(point.x, w);
        point.y = Math.min(point.y, h);
        edge[point.x+','+point.y] = true;
    }
    function dropDown(ant){
        if(isEdge(ant, 0, 1)){
            _head = ahead.addr;
            edgePoint(_head);
            //console.log(_head);
            //_showCenterPoint(_head.x, _head.y);
            edgeDetection(ahead);
        }else{
            dropDown(ahead);
        }
    }
    function isEdge(ant, posx, posy){
        if(ant.addr.x>=w||ant.addr.y>=h||ant.addr.x<=0||ant.addr.y<=0) return true;
        ahead = ant._pos(posx||0, posy||0);
        ab = aberration(_ant.color, ahead.color);
        return ab>_ts;
    }
    function _referee(point){/*judge finished or not*/
        if(point.x === _head.x&&point.y===_head.y&&n>0) return true;
        if(!edge[point.x+','+point.y]){
            edgePoint(point);
            return false;
        }
    }
    function edgeDetection(ant){
        if(_referee(ahead.addr)){
            finish = true;
            console.log(n);
            drawEdge();
            return;
        }
        n+=1;
        switch (ant.head){
            case 0:/*down*/
                if(isEdge(ant, -1, 0)){/*right side is not the edge*/
                    if(isEdge(ant, 0, 1)){/*down side is not the edge*/
                        ant.head = 3;/*turn right*/
                        edgeDetection(ant);
                    }else{
                        edgeDetection(ahead);/*go ahead*/
                    }
                }else{
                    ahead.head = 1;/*turn left and go ahead*/
                    edgeDetection(ahead);/*recursion*/
                }
                break;
            case 1:/*left*/
                if(isEdge(ant, 0, -1)){/*check up*/
                    if(isEdge(ant, -1, 0)){/*check left*/
                        ant.head = 0;/*turn down*/
                        edgeDetection(ant);
                    }else{
                        edgeDetection(ahead);
                    }
                }else{
                    ahead.head = 2;/*turn up*/
                    edgeDetection(ahead);
                }
                break;
            case 2:/*up*/
                if(isEdge(ant, 1, 0)){/*check right*/
                    if(isEdge(ant, 0, -1)){/*check up*/
                        ant.head = 1;/*turn left*/
                        edgeDetection(ant);
                    }else{
                        edgeDetection(ahead);
                    }
                }else{
                    ahead.head = 3;/*turn right*/
                    edgeDetection(ahead);
                }
                break;
            case 3:/*right*/
                if(isEdge(ant, 0, 1)){/*check down*/
                    if(isEdge(ant, 1, 0)){/*check right*/
                        ant.head = 2;/*turn up*/
                        edgeDetection(ant);
                    }else{
                        edgeDetection(ahead);
                    }
                }else{
                    ahead.head = 0;/*turn down*/
                    edgeDetection(ahead);
                }
                break;
            default :break;
        }
    }
    function drawEdge(){
        for(var i in edge){
            var point = i.split(',');
            _showCenterPoint(point[0], point[1]);
        }
    }
    function aberration(point1, point2){
        var dr = point1.r-point2.r,
            dg = point1.g-point2.g,
            db = point1.b-point2.b;
        return Math.sqrt(dr*dr*3+dg*dg*4+db*db*2);
    }
    function getRGBA(point){
        var index = (point.x+point.y*w)*4;
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
        ctx.save();
        ctx.fillStyle = path.fillColor;
        ctx.fillRect(path.origin.x, path.origin.y, path.size.w, path.size.h);
        ctx.restore();
        //return path;
    }
    img.onload = initPage;
})(window);