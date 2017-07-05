/**
 * Created by bobo on 2017/3/20.
 */
(function(window){
    var w = window.innerWidth, h = window.innerHeight;
    var canvas = window.document.querySelector('#canvas');
    var ctx = canvas.getContext('2d');
    var imgData = [], Paths = {}, key = 0, Type = {};
    function mosaic(){
        canvas.width = w;
        canvas.height = h;
        var path1 = new Path();
        path1.Rectangle({
            origin:{x:0, y:0},
            size:{w:100,h:100},
            monitorType:'click',
            monitorEvent:evnt
        });
        var path2 = new Path();
        path2.Rectangle({
            origin:{x:150, y:0},
            size:{w:100,h:100},
            monitorType:'mousemove',
            monitorEvent:evnt
        });
    }
    function evnt(path, pos){
        path.setAttr({fillColor:'rgba(255,0,0,1)'});
    }
    function Path(){
        this.origin = {x:0,y:0};
        this.size = {w:10,h:10};
        this.fillColor = 'rgba(0, 255, 0, 1)';
    }
    Path.prototype = {
        constructor:Path,
        Rectangle:function(config){
            this.setAttr(config);
            if(this.monitorType) this.monitor();
        },
        setAttr:function(data){
            mergeObject(this, data);
            this.redraw();
        },
        monitor:function(){
            this.key = key;
            if(this.monitorType){
                if(!Paths[this.monitorType]){
                    detector(this.monitorType);
                    Paths[this.monitorType] = {};
                }
                Paths[this.monitorType][key] = this;
            }else{
                Paths[key] = this;
            }
            key += 1;
        },
        setBounds:function(){
            this.maximumx = this.origin.x+this.size.w;
            this.maximumy = this.origin.y+this.size.h;
            this.center = {
                x:Math.ceil(this.origin.x+this.size.w/2),
                y:Math.ceil(this.origin.y+this.size.h/2)
            };
            return this;
        },
        getCenterColor:function(){
            var x = this.center.x, y = this.center.y;
            var num = (x+(y-1)*w)*4;
            var r = imgData[num], g = imgData[num+1], b = imgData[num+2], a = imgData[num+3]/255;
            //console.log(r, g, b, a);
            return 'rgba('+r+','+g+','+b+','+a+')';
        },
        remove:function(){
            if(this.monitorType){
                delete Paths[this.monitorType][this.key];
            }else{
                delete Paths[this.key];
            }
        },
        redraw:function(){
            ctx.clearRect(this.origin.x, this.origin.y, this.size.w, this.size.h);
            this.setBounds();
            drawRectangle(this);
        },
        _showCenterPoint:function(){
            drawRectangle({
                fillColor:'#00ff00',
                origin:this.center,
                size:{w:1, h:1}
            });
        }
    };
    function detector(type){
        var left = canvas.offsetLeft, top = canvas.offsetTop;
        canvas.addEventListener(type, function(event){
            var e = event||window.event;
            var rx = e.clientX-left, ry = e.clientY-top;
            for(var i in Paths[type]){
                var p = Paths[type][i];
                if( rx>p.origin.x && rx<=p.maximumx && ry>p.origin.y && ry<=p.maximumy ){
                    if(p.monitorEvent) p.monitorEvent(p, [rx, ry]);
                }
            }
        });
    }
    function drawRectangle(path){
        ctx.save();
        ctx.fillStyle = path.fillColor;
        ctx.fillRect(path.origin.x, path.origin.y, path.size.w, path.size.h);
        ctx.restore();
        //return path;
    }
    function mergeObject(result, obj){
        if(!obj) return result;
        for(var i in obj){
            result[i] = obj[i];
        }
        return result;
    }

    mosaic();
})(window);