/**
 * Created by Administrator on 2016/6/22.
 */
(function(){
    var objXMLHttp;
    var msg = document.getElementById('msg');

    function createXMLHttpRequest(){
        //对于Firefox,Opera等遵守DOM2规范的浏览器
        if(window.XMLHttpRequest){
            objXMLHttp = new XMLHttpRequest();
        }else{
            //将IE浏览器不同的XMLHttp实现声明为数组
            var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
            //依次对每个XMLHttp创建XMLHttpRequest对象
            for(var i = 0; i<MSXML.length; i++){
                try{
                    //微软发布的是ActiveX控件
                    objXMLHttp = new ActiveXObject(MSXML[i]);
                    //如果正常创建XMLHttpRequest对象就使用break跳出循环
                    break;
                }catch(e){
                    alert("创建XMLHttpRequest对象失败");
                }
            }
        }
    }

    function postSend(){
        var value = document.getElementById("content").value;
        //初始化XMLHttpRequest对象
        createXMLHttpRequest();
        //创建请求的URL
        var url = "./spineboy.json";
        //打开与服务器的连接，使用post方式
        objXMLHttp.open("POST", url, true);
        //post方式需要设置请求消息头
        objXMLHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //设置处理响应的回调函数
        objXMLHttp.onreadystatechange = processResponse;
        //发送请求并设置参数，参数的设置为param=value的形式
        objXMLHttp.send("value="+value);
    }

    function getSend(){
        var value = document.getElementById("content").value;
        //初始化XMLHttpRequest对象
        createXMLHttpRequest();
        //创建请求的URL,get方式采用url拼接参数
        var url = "../base.css?value="+value;
        objXMLHttp.open("GET", url, true);
        //设置处理响应的回调函数
        objXMLHttp.onreadystatechange = processResponse;
        objXMLHttp.send(null);
    }

    function processResponse(){
        //响应完成且响应正常
        var div = document.createElement('div');
        if(objXMLHttp.readyState == 1){
            div.innerHTML = "XMLHttpRequest对象开始发送请求"
        }else if(objXMLHttp.readyState == 2){
            div.innerHTML = "XMLHttpRequest对象的请求发送完成";
        }else if(objXMLHttp.readyState == 3){
            div.innerHTML = "XMLHttpRequest对象开始读取服务器的响应";
        }else if(objXMLHttp.readyState == 4){
            div.innerHTML = "XMLHttpRequest对象读取服务器响应结束";
            if(objXMLHttp.status == 200){
                var headers = objXMLHttp.getAllResponseHeaders();
                div.innerHTML = "所有的请求头= "+headers;
                //得到服务器返回的信息
                var infor = objXMLHttp.responseText;
                div.innerHTML = "服务器端的响应 = "+infor;
            }else{
                div.innerHTML = "所请求的服务器端出了问题";
            }
        }
        msg.appendChild(div);
    }
})();