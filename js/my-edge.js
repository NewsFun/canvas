/**
 * Created by bobo on 2017/4/21.
 */
(function(window){
    var canvas = window.document.querySelector('#dolly');
    var img = new Image();
    img.src = '../img/5.jpg';
    var w = img.width, h = img.height;
    var ctx = canvas.getContext('2d');
    var imgData = [], _ts = 80, react = {}, edge = {}, _ant = {}, _head = null, n = 0;
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
            /*
            this.addr.x += dx;
            this.addr.y += dy;
            return this;
            */
            return new Ant({
                x:this.addr.x+dx,
                y:this.addr.y+dy,
                head:this.head
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
            react = {maxx:rx, minx:rx, maxy:ry, miny:ry};
            _ant = new Ant({x:rx, y:ry});
            //rgba = _ant.color;
            dropDown(_ant);
        }
    }
    function dropDown(ant){
        if(Object.keys(edge).length<1){
            ahead = ant._pos(0, 1);
            ab = aberration(_ant.color, ahead.color);
            if(ab>_ts){
                _head = ahead.addr;
                edge[_head.x+','+_head.y] = true;
                //_referee(_head);
                console.log(_head);
                edgeDetection(ahead);
                drawEdge();
            }else{
                dropDown(ahead);
            }
        }
    }
    function _referee(point){
        if(point.x === _head.x&&point.y===_head.y&&n>0) return true;
        if(!edge[point.x+','+point.y]){
            edge[point.x+','+point.y] = true;
            return false;
        }
    }
    function edgeDetection(ant){
        if(_referee(ahead.addr)){
            console.log(n);
            return;
        }
        /*if(n>5000){
            console.log(n);
            return;
        }*/
        n+=1;
        switch (ant.head){
            case 0:/*down*/
                ahead = ant._pos(-1, 0);/*check right*/
                ab = aberration(_ant.color, ahead.color);
                if(ab>_ts){/*right side is not the edge*/
                    ahead = ant._pos(0, 1);
                    ab = aberration(_ant.color, ahead.color);
                    if(ab>_ts){/*down side is not the edge*/
                        ant.head = 3;/*turn right*/
                        edgeDetection(ant);
                    }else{
                        /*go ahead*/
                        _referee(ahead.addr);
                        edgeDetection(ahead);/*recursion*/
                    }
                }else{
                    ahead.head = 1;/*turn left and go ahead*/
                    _referee(ahead.addr);
                    edgeDetection(ahead);/*recursion*/
                }
                break;
            case 1:/*left*/
                ahead = ant._pos(0, -1);/*check up*/
                ab = aberration(_ant.color, ahead.color);
                if(ab>_ts){
                    ahead = ant._pos(-1, 0);
                    ab = aberration(_ant.color, ahead.color);
                    if(ab>_ts){
                        ant.head = 0;/*turn down*/
                        edgeDetection(ant);
                    }else{
                        _referee(ahead.addr);
                        edgeDetection(ahead);
                    }
                }else{
                    ahead.head = 2;/*turn up*/
                    _referee(ahead.addr);
                    edgeDetection(ahead);
                }
                break;
            case 2:/*up*/
                ahead = ant._pos(1, 0);/*check right*/
                ab = aberration(_ant.color, ahead.color);
                if(ab>_ts){
                    ahead = ant._pos(0, -1);/*check up*/
                    ab = aberration(_ant.color, ahead.color);
                    if(ab>_ts){
                        ant.head = 1;/*turn left*/
                        edgeDetection(ant);
                    }else{
                        _referee(ahead.addr);
                        edgeDetection(ahead);
                    }
                }else{
                    ahead.head = 3;/*turn right*/
                    _referee(ahead.addr);
                    edgeDetection(ahead);
                }
                break;
            case 3:/*right*/
                ahead = ant._pos(0, 1);/*check down*/
                ab = aberration(_ant.color, ahead.color);
                if(ab>_ts){
                    ahead = ant._pos(1, 0);/*check right*/
                    ab = aberration(_ant.color, ahead.color);
                    if(ab>_ts){
                        ant.head = 2;/*turn up*/
                        edgeDetection(ant);
                    }else{
                        _referee(ahead.addr);
                        edgeDetection(ahead);
                    }
                }else{
                    ahead.head = 0;/*turn down*/
                    _referee(ahead.addr);
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
        //ctx.moveTo(config.origin.x, config.origin.y);
        ctx.save();
        ctx.fillStyle = path.fillColor;
        ctx.fillRect(path.origin.x, path.origin.y, path.size.w, path.size.h);
        ctx.restore();
        return path;
    }
    img.onload = initPage;
})(window);