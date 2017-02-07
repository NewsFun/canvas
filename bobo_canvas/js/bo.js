/**
 * Created by bobo on 2016/12/15.
 */
(function(global){
    var W = global.innerWidth,
        H = global.innerHeight,
        MUD = {},
        Num = 0;
    var Bo = {
        addElf:function(param){
            var mud = new Mud(param);
            MUD[mud.name] = mud;
            Num ++;
        },
        removeElf:function(name){
            delete MUD[name];
        },
        render:function(){

        },
        draw:function(mud){
            switch (mud.type){
                case 'square':break;
                case 'circle':break;
                case 'image':break;
                case 'line':break;
                default :break;
            }
        }
    };
    var Mud = function (param){
        var self = this;
        this.config = {
            name:'elf'+Num,
            type:'image',
            width:200,
            height:200,
            position:{x:0,y:0}
        };
        var init = function(){
            initConfig(param);
            return self.config;
        };
        function initConfig(param){
            for(var i in param){
                self.config[i] = param[i];
            }
        }
        init();
    };
    if(!global.Bo) global.Bo = Bo;
})(window);