/**
 * Created by bobo on 2017/6/6.
 */
function Random(){
    Math.seed = 10;
    Math.seededRandom = function (max, min) {
        max = max || 1;
        min = min || 0;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280.0;
        return min + rnd * (max - min);
    };
    for (var i = 0; i < 10; i++) {
        document.writeln(Math.seededRandom() + "<br />");
    }
}
function test(n){
    var bobo = $('#test td');
    var  table = [];
    var b = [];
    var len = bobo.length;

    for(var i = 0;i<len;i++){
        b.push(bobo.eq(i).prop('outerHTML'));
        if(i==len-1||(i+1)%n==0){
            table.push('<tr>'+b.join('')+'</tr>');
            b = [];
        }
    }
    //console.log(table);
    $('#test').html(table.join(''));
}