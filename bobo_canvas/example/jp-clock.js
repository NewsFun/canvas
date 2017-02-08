(function(ns){
	var $canvas,canvas;
	var context;
	var contextActive=true;
	var contextRockTimer;
	var timer;
	var clockBox;
	var screenWidth,screenHeight;
	var winW,winH;
	var lastwinW,lastwinH;
	var canvasW,canvasH;
	var breakP=415;
	var halfP={};
	var canvasScaleResio=1;
	var canvasPercent="100%";
	var startDate=new Date();
	var lastPastTime=0;
	var canvasResio;
	
	var contentMarginX,contentMarginY;
	var contentScaleResio;
	//var contentOriginW=626;
	//var contentOriginH=626;
	var contentOriginW=740;
	var contentOriginH=830;
	var contentsVHResio=contentOriginH/contentOriginW;
	var addScaleResio=1.182;
	var degitalImages;
	
	var openEnd=false;
	var changeEnd=true;
	var topClose=false;
	var topOpen=false;
	
	var drawW,drawH;
	
	var setEnd=false;
	
	
	var menuBtnBox;
	var menuBtnBoxW;
	var menuBtnBoxLines;
	
	
	ns.canvasDoubleSize;
	ns.haloPointer;
	
	ns.setCanvas=function(){
		
		screenWidth=screen.width;
		screenHeight=screen.height;
		
		
		menuBtnBox=$("#menu_btn_box")
		menuBtnBoxW=$("#menu_btn_box").width();
		menuBtnBoxLines=$("#menu_btn_box .lines>div")
		
		
		degitalImages=$("#degital img.degital");
		
		$canvas=$("#clock");
		canvas=$canvas[0];
		ns.canvas=canvas;
		ns.$canvas=$canvas;
		
		if(utils.pc){
			
		}else{
			canvasW=(screenWidth>screenHeight)?screenWidth:screenHeight;
			
			if(screenWidth<breakP){
				canvasW*=2;
				ns.canvasDoubleSize=true;
				
			}
			
			canvasH=canvasW;
			canvas.width=canvasW;
			canvas.height=canvasH;
				
		}
		context=canvas.getContext('2d');
		ns.context=context;
		
		clockBox=new Clock();
		ns.clockBox=clockBox;
	
		
		timer=setInterval(function(){
			
				render();
			
		},25);
		setEnd=true;
		ns.timer=timer;
		
	}
	
	ns.setCanvas8=function(){
		degitalImages=$("#degital img.degital");
		
		clockBox=new Clock8();
		ns.clockBox=clockBox;
		
		setTimeout(function(){
			
		$("#degital").addClass("show");
		$("#content").addClass("show");
		
		openEnd=true;
		var win=$(window);
		ns.clockResize8(win.width(),win.height());
		
		timer=setInterval(function(){
			checkDate();
			
		},25);
		},50)
	}
	
	///////////////////////
	//
	//    checkDate
	//
	///////////////////////
	
	checkDate=function(){
		nowTime=new Date();
		var pastTime=Number(nowTime)-Number(startDate);
		var d=Math.floor(pastTime/(24*60*60*1000));
		pastTime%=(24*60*60*1000);
		var h=Math.floor(pastTime/(60*60*100));
		pastTime%=(60*60*1000);
		var m=Math.floor(pastTime/(60*1000));
		pastTime%=(60*1000);
		var s=Math.floor(pastTime/(1000));
		var ms=(pastTime%1000);
		clockBox.setClockTime(d,h,m,s,ms,pastTime);
		
		lastPastTime=pastTime;
	}
	
	////////////////////
	//
	//    resizeHl
	//
	/////////////////////
	
	ns.clockResize=function(w,h){
		if(setEnd){
			canvasResio=100;
			var marginLeft,marginTop;
			var VHResio;
			
			winW=w;
			winH=h;
			
			lastwinW=w;lastwinH=h;
			
			contentMarginX=0;
			contentMarginY=0;
			contentScaleResio=1;
			
			
			
			
				if(winW<=767){
					VHResio=winH/winW;
					if(VHResio<contentsVHResio){
						contentScaleResio=winH/contentOriginH;
					}else{
						contentScaleResio=winW/contentOriginW;
					}
					ns.contentW=contentOriginW*contentScaleResio;
					ns.contentH=contentOriginH*contentScaleResio;
					
					
					menuBtnBox.css({
					"width":ns.contentW*0.06406,
					"top":ns.contentW*0.05215,
					"right":ns.contentW*0.04563
					})
					
				
				}else{
						menuBtnBox.attr("style","");
						menuBtnBoxLines.attr("style","");
				}
				var menuBtnBoxW=menuBtnBox.width();	
				menuBtnBox.css({
					"height":menuBtnBoxW
				})
				
				//if(winW<=767){
					var lineH=Math.round(menuBtnBoxW*0.096);
					if(ns.yoko){
						if(lineH<1){lineH=1;}
					}else{
						if(lineH<2){lineH=2;}
					}
					
					menuBtnBoxLines.css({
					"height":lineH
					});
					var ltop1=Math.round(menuBtnBoxW*0.131);
					var ltop2=Math.round(menuBtnBoxW*0.452);
					var lineSpace=ltop2-(ltop1+lineH)
					var ltop3=ltop2+lineH+lineSpace;
					
					menuBtnBoxLines.eq(0).css("top",ltop1);
					menuBtnBoxLines.eq(1).css("top",ltop2);
					menuBtnBoxLines.eq(2).css("top",ltop2);
					menuBtnBoxLines.eq(3).css("top",ltop3);
				//}
			
			
			
			
			
			if(utils.pc){
				
			
			}else{				
				if(w<canvasW || h<canvasH){
					canvasResio=(w<h)?h/w:1;
					canvasScaleResio=(w<h)?canvasH/winH:canvasW/winW;
					
					if(w>h){
						marginLeft=0;
						marginTop=(h-w)/2;
					}else{
						marginLeft=(w-w*canvasResio)/2;
						marginTop=0;
					}
					
				}else{
					canvasScaleResio=1;
					marginLeft=(w-canvasW*canvasResio)/2;
					marginTop=(h-canvasH*canvasResio)/2;
				}
				//canvasScaleResio=1;
				
				$canvas.css({
					"width":canvasResio*100+"%",
					"left":marginLeft,
					"top":marginTop
				});
			}
			
			if(utils.android){
				if(contextRockTimer){
					clearTimeout(contextRockTimer)	
				}
				
				contextActive=false;
				//
				contextRockTimer=setTimeout(function(){
					canvas.width=canvasW;
					contextActive=true;
					render();
					setFontSize();
				},1000);
				
			}else{
				
				render();
				
				
			}
		}
		setFontSize();
	}
	
	
	//resize ie8
	ns.clockResize8=function(w,h){
		winW=w;
		winH=h;
		contentScaleResio=1;
		if(openEnd){			
			clockBox.drawBox();
			setFontSize();
		}	
		
		
	}
	
	

	
	function render(){
		//trace2("render")
		//キャンバスの再描画
		if(utils.pc){
			//
			
			canvas.width=winW;
			canvasW=winW;
			canvas.width=canvasW=winW;
			canvas.height=canvasH=winH;
			
		}else{
			if(contextActive){
				if(utils.sp){
					canvas.width=canvasW;
				}else{
					context.clearRect(0,0,canvasW,canvasH);
				}
			}else{
				//context.clearRect(0,0,canvasW,canvasH);
			}
		}
		
		if(utils.android){
			if(contextActive){
				clockBox.drawBox();
			}
		}else{
			clockBox.drawBox();
		}
		
		if(openEnd && changeEnd){
		
			//時間表示
			checkDate();
			
			
			if(utils.android){
			
				if(contextActive){
					clockBox.drawClock();
					clockBox.drawCircleObj();
					
				}
			}else{
				//clockBox.drawBox();
				clockBox.drawClock();
				clockBox.drawCircleObj();
				
			}
		}else if(changeEnd){
			//オープニングアニメ
			clockBox.openingAnimation()	
		}else{
			if(topClose){
				//切換え表示画面
				clockBox.openPageAnime();
			}else if(topOpen){
				//切換え表示画面
				clockBox.resumeTopPageAnime();
			}else{
				//(!openEnd&&!changeEnd&&!topClose &&!topOpen)
				//ページが別表示になっている時
				
				
				if(ns.pageSlide){
					ns.pageSlideRender();
				}else{
					ns.pageClockRender();
				}
			}
		}
		
	}
	
	
	
	function Clock8(){
		this.prototype=Object;
		var degitalTimes=[0,0,0,0,0,0]
		var rotationTime=2000;//2000msに1回回転;
		
		var canvasArea=$("#canvas_area");
		var mainBackH=1200;
		var mainBackW=1600;
		var mainBackVHResio=mainBackH/mainBackW;
		
		this.setClockTime=function(d,h,m,s,ms,past){
			this.day=d;
			this.hour=h;
			this.minute=m;
			this.second=s;
			this.milisecond=ms;
			
			var date=new Date();
			this.hour=date.getHours();
			this.minute=date.getMinutes();
			this.second=date.getSeconds();
			
			var hString=(this.hour<10)?"0"+this.hour:String(this.hour);
			var mString=(this.minute<10)?"0"+this.minute:String(this.minute);
			var sString=(this.second<10)?"0"+this.second:String(this.second);
			var nowTimeStrs=[];
			
			nowTimeStrs=nowTimeStrs.concat(hString.split(""));
			nowTimeStrs=nowTimeStrs.concat(mString.split(""));
			nowTimeStrs=nowTimeStrs.concat(sString.split(""));
			for(var n=0;n<6;n++){
				var degitalText=degitalTimes[n];
				var nowTimeStr=nowTimeStrs[n];
				
				if(degitalText!=nowTimeStr){
					var targetimg=	degitalImages.eq(n);
					targetimg.attr("src","img/index/nums/num"+nowTimeStr+".png");
					degitalTimes[n]=nowTimeStr;
				}
			}
			
			this.countTimeResio=(past%rotationTime)/rotationTime;
		}
		
		this.drawBox=function(){
			
			contentMarginX=contentMarginY=0;
		
			if(winW<contentOriginW || winH<contentOriginH){
				VHResio=winH/winW;
				if(VHResio<contentsVHResio){
					contentScaleResio=winH/contentOriginH;
				}else{
					contentScaleResio=winW/contentOriginW;
				}
			}
				
			ns.contentW=contentOriginW*contentScaleResio;
			ns.contentH=contentOriginH*contentScaleResio;
	
			contentMarginX=-(ns.contentW-winW)/2;
			contentMarginY=-(ns.contentH-winH)/2;
	
			
			ns.content.css({
				"width":ns.contentW,
				"height":ns.contentH,
				"left":contentMarginX,
				"top":contentMarginY
			});
			var mainBackRecio;
			if(mainBackVHResio>winH/winW){
				canvasArea.height(winW*mainBackVHResio);
				canvasArea.width(winW);
				canvasArea.css({
					"top":(winH-winW*mainBackVHResio)/2,
					"left":0
				})
			}else{
				canvasArea.height(winH);
				canvasArea.width(winH/mainBackVHResio);
				canvasArea.css({
					"top":0,
					"left":(winW-winH/mainBackVHResio)/2
				})
			}
			
			ns.pagesBox.css({
				"width":ns.contentW,
				"height":ns.contentH,
				"left":contentMarginX,
				"top":contentMarginY
			});
			
			
			
		}
		
		this.openPage=function(num){
			//ie8用
			openpageNum=num;
			ns.pageOpenBtnActiv=false;
			$("#content,#degital,h1.logo").removeClass("show");
			$("#content .box").removeClass("show");
			ns.pageOpenEnd(openpageNum);
			
		}
		
		this.resumeTopPage=function(){
			
			/*startDate=new Date();*/
			
			$("#content").addClass("show");
			$("#degital").addClass("show");
			$("h1.logo").addClass("show");
			$("#content .box").addClass("show");
			
			ns.resumeTopPageEnd()
		}
		
	}
	
	
	function Clock(){
		this.prototype=Object;
		
		var outR=0.98466/addScaleResio;
		
		var outR1=0.69/addScaleResio;
		var outR2=0.53035/addScaleResio;
		var outR3=0.86/addScaleResio;
		
		
		var clockDiv=120;
		
		var center={};
		var pZero={};
		var marginX,marginY;
		this.time=new Object();
		this.day=0;
		this.hour=0;
		this.minute=0;
		this.second=0;
		this.milisecond=0;
		this.countTimeResio;
		
		var degitalTimes=[0,0,0,0,0,0]
		
		var rotationTime=2000;//2000msに1回回転;
		
		var haloPointer;
		
		var changepageNum;
		var changepageSpStartNum;
		var openpageCnStartNum;
		
		//////////////////////
		//5個のポインターオブジェクト生成
		//////////////////////
		
		var clickPoints=[];
		var pointerDiv=ns.pointerImage.length;
		
		for(var n=0;n<pointerDiv;n++){
			var clickPointObj=new clickPoint();
			clickPointObj.pointRad=n*Math.PI*2/pointerDiv-Math.PI/2;
			clickPointObj.img=ns.pointerImage[n];
			clickPointObj.serialNum=n;
			clickPointObj.lastPointDeg=n*Math.PI*2/pointerDiv-Math.PI/2;
			clickPoints.push(clickPointObj)
		}
		
		//////////////////////
		//16個のスモールポイント生成
		//////////////////////
		var startMultipleNum=1;
		var smallPointerDiv=16;
		smallPointerDiv*=startMultipleNum;
		
		var smallPoints=[];
		var activePointerNum;
		var activePointer
		var disActivePointer;
		var nowPointerNum;
		var lastPointerNum;
		
		var spOpeneingAnimeDiv=100;
		//spOpeneingAnimeDiv=50;
		ns.openingCountDiv=spOpeneingAnimeDiv;
		var spOpeneingAnimeCount=0;
		var spOpeningScaleY;
		var spOpeningScaleDeg;
		var spNowCount;
		var spNowCountResio;
		var spYuragiMax=40;
		var spAddDeg;
		
		var cnR;
		var cnAnimeResio;
		var cnAnimeResio2;
		var cnAnimeResio3;
		var cnYResio;
		var cnEffectChange=false;
		
		var cpAddDeg;
		
		for(var n=0;n<smallPointerDiv;n++){
			var sPoint=new smallPoint();
			sPoint.lastPointDeg=startMultipleNum*n*Math.PI*2/smallPointerDiv-Math.PI/2;
			sPoint.serialNum=n;
			smallPoints.push(sPoint);
		}
		
		
		
		//activePointer.show();
		
		
		
		//////////////////////
		//120個のニードル生成
		//////////////////////
		var clockNeadles=[];
		var neadleCount;
		for(var n=0;n<clockDiv;n++){
			var neadle=new clockNeadle();
			neadle.serialNum=n;
			neadle.endDeg=(n*Math.PI*2)/clockDiv-Math.PI/2;
			clockNeadles.push(neadle);
		}
		
		//////////////////////
		//4個のスモールナンバー生成
		//////////////////////
		var smallNums=[];
		for(var n=0;n<4;n++){
			var smallNum=new smallNumObj();
			smallNum.serialNum=n;
			smallNum.img=ns.numSimg[n];
			smallNum.deg=(n*Math.PI/2)-Math.PI/2;
			smallNums.push(smallNum);
		}
		
		//////////////////////////////////
		//
		//オープニングアニメ
		//
		///////////////////////////////////
		
		this.openingAnimation=function(){
			
			var pointR=drawW*0.0127/2/addScaleResio;
			
			spNowCount=spOpeneingAnimeDiv-spOpeneingAnimeCount;
			spNowCountResio=spOpeneingAnimeCount/spOpeneingAnimeDiv;
			spOpeneingAnimeCount+=1;
			ns.openingCount=spOpeneingAnimeCount;
			spAddDeg=spNowCount*(Math.PI*4)/spOpeneingAnimeDiv;
			
			cnR=drawW*outR2/2;
			cnAnimeResio=spNowCount/spOpeneingAnimeDiv;
			cnAnimeResio2=Math.cos(Math.pow(spNowCountResio,10)*Math.PI);
			cnAnimeResio3=Math.cos(spNowCountResio*Math.PI/2);
			cnYResio=Math.abs(Math.cos(Math.pow(spNowCountResio,2)*Math.PI*2));
			
			cpAddDeg=spNowCount*(Math.PI*2)/spOpeneingAnimeDiv;
			cpAnimeResio=Math.cos(Math.pow(spNowCountResio,0.5)*Math.PI/2+Math.PI/20);
			
			if(cpAnimeResio<0){
				cpAnimeResio=0;
			}
		
			if(cnAnimeResio2<=0 && !cnEffectChange){
				cnEffectChange=true;
			}
			if(cnEffectChange){
				cnYResio=1;
			}
			
			if(spNowCountResio<1){
				
				//trace2("spNowCountResio="+spNowCountResio)
				spOpeningScaleDeg=Math.PI/2-Math.PI*2/2*Math.pow(spNowCountResio,1);
				spOpeningScaleY=Math.abs(Math.sin(spOpeningScaleDeg));
				spOpeningScaleY=0.5+spOpeningScaleY/2;
				
				//smallPoint
				for(var n=0;n<smallPointerDiv;n++){
					var targetSP=smallPoints[n];
					targetSP.w=targetSP.h=pointR;
					targetSP.doOpeningAnime();
				}
				
				
				//clockNeadle
				for(var n=0;n<clockDiv;n++){
					var targetNd=clockNeadles[n];
					targetNd.doOpeningAnime();
				}
				
				//clickPoint
				var pointerPoints=[];
				var lastPoint;
				var nowPoint;
				for(var n=0;n<pointerDiv;n++){
					var targetCp=clickPoints[n];
					pointerPoints.push(targetCp.doOpeningAnime());
					if(n>0){
						
						lastPoint=pointerPoints[n-1];
						nowPoint=pointerPoints[n];
						//if(n>1){
							targetCp.drawPointerLine(nowPoint,lastPoint);
						//}
						targetCp.drawImage();
						
						if(n==pointerDiv-1){
							lastPoint=pointerPoints[n];
							nowPoint=pointerPoints[0];
							targetCp.drawPointerLine(nowPoint,lastPoint);
							targetCp=clickPoints[0];
							targetCp.drawImage();
						}
					}
					
				}
				
				if(spNowCount<10){
					for(var n=0;n<4;n++){
						var targetSn=smallNums[n];
						targetSn.drawImage();
					}
				}
			}else{
				
				spOpeningScaleY=1;
				spNowCountResio=1;
				
				///////////////////////////
				//再構築
				///////////////////////////
				
				//
				
				smallPoints=[];
				smallPointerDiv=16;
				for(var n=0;n<smallPointerDiv;n++){
					var sPoint=new smallPoint();
					sPoint.lastPointDeg=n*Math.PI*2/smallPointerDiv-Math.PI/2;
					sPoint.serialNum=n;
					smallPoints.push(sPoint);
				}
	
				//nowPointerNum=0;
				lastPointerNum=smallPointerDiv-1;
				nowPointerNum=0
				activePointer=smallPoints[nowPointerNum];
				activePointer.show();
				
				startDate=new Date();
				
				openEnd=true;
				
				render();
				$("#content,#degital,h1.logo").addClass("show");				
			}
			
			
		}
		
		//////////////////////////////////
		//
		//ページオープン
		//
		///////////////////////////////////
		
		var pageOpenCountDiv=60;
		var pageOpenCount=0;
		var pageOpenResio;
		
		var pageCloseCountDiv=85;
		var pageCloseCount=0;
		var pageCloseResio;
		
		this.openPage=function(num){
			openpageNum=num;
			
			
			
			switch(num){
				case 0: openpageSpStartNum=1;break;
				case 1: openpageSpStartNum=1;break;
				case 2: openpageSpStartNum=4;break;
				case 3: openpageSpStartNum=7;break;
				case 4: openpageSpStartNum=10;break;
				case 5: openpageSpStartNum=13;break;
			}
			
			pageOpenCount=0;
			for(var n=0;n<smallPointerDiv;n++){
				smallPoints[n].openPageCount=0;
			}
			openpageCnStartNum=Math.floor(clockDiv*(num-1)/5)
			for(var n=0;n<clockDiv;n++){
				clockNeadles[n].openPageCount=0;
			}
			
			for(var n=0;n<pointerDiv;n++){
				clickPoints[n].openPageCount=0;
				clickPoints[n].scale=1;
				
				
			
			}
			changeEnd=false;//時計を出さない
			topClose=true;//トップページクローズ
			
			cnYResio=1;
			
			ns.pageOpenBtnActiv=false;
			$("#content,#degital,h1.logo").removeClass("show");
			
			//
		}
		
	
		
		this.openPageAnime=function(){
			pageOpenResio=pageOpenCount/pageOpenCountDiv;
			
			var pointR=drawW*0.0127/2/addScaleResio;
			//smallPoint
			for(var n=0;n<smallPointerDiv;n++){
				var targetNum=openpageSpStartNum-n;
				if(targetNum<0){
					targetNum+=smallPointerDiv;
				}
				var targetSP=smallPoints[targetNum];
				targetSP.w=targetSP.h=pointR;
				targetSP.opacity=1;
				targetSP.doOpenPageAnime(n);
			}
			
			cnR=drawW*outR2/2;
			
			for(var n=0;n<clockDiv;n++){
				clockNeadles[n].opacity=1;
				clockNeadles[n].doOpenPageAnime(n);
				
			}
			for(var n=1;n<pointerDiv;n++){
				clickPoints[n].opacity=1;
				clickPoints[n].doOpenPageAnime(n);
			}
			clickPoints[0].doOpenPageAnime(n);
			pageOpenCount+=1;
			
			if(pageOpenCount>=pageOpenCountDiv){
				//アニメーション終了
				topClose=false;
				ns.pageOpenEnd(openpageNum);
				//
			}
		}
		
		
		///////////////////////////
		//
		//トップページに戻る
		//
		//////////////////////////
		
		this.resumeTopPage=function(){
			
			startDate=new Date();
			
			pageCloseCount=0;
			for(var n=0;n<smallPointerDiv;n++){
				smallPoints[n].closePageCount=0;
				smallPoints[n].opacity=0;
			}
			
			
			
			for(var n=0;n<clockDiv;n++){
				clockNeadles[n].closePageCount=0;
				clockNeadles[n].opacity=0;
			}
			
			for(var n=0;n<pointerDiv;n++){
				clickPoints[n].closePageCount=0;
				clickPoints[n].scale=0;
				clickPoints[n].opacity=0;
			}
			
			
			topOpen=true;changeEnd=false;
			
			//resumeTopPageAnimeスタート
		}
		
		this.resumeTopPageAnime=function(){
			pageCloseResio=pageCloseCount/pageCloseCountDiv;
			
			
			var pointR=drawW*0.0127/2/addScaleResio;
			
			for(var n=0;n<smallPointerDiv;n++){
				smallPoints[n].doRegumeTopPageAnime(n);
			}
			cnR=drawW*outR2/2;
			
			for(var n=0;n<clockDiv;n++){
				clockNeadles[n].doRegumeTopPageAnime(n);
			}
			
			for(var n=0;n<pointerDiv;n++){
				clickPoints[n].doRegumeTopPageAnime(n);
			}
			
			pageCloseCount+=1;
			
			
			if(pageCloseCount>=pageCloseCountDiv){
				//アニメーション終了
				topOpen=false;
				openEnd=true;
				changeEnd=true;
				
				$("#content,#degital,h1.logo").addClass("show");
				$("#content .box").addClass("show");
				
				ns.resumeTopPageEnd();
			}
		}
		
		
		///////////////////////////
		//
		//マウスオーバー
		//
		///////////////////////////
		
		this.showPointerHalo=function(num){

			if(haloPointer){
				haloPointer.halo=false;
			};
			if(num<3){
				ns.pageOpenBtn.eq(num-1).addClass("zoom");
			}
			
			haloPointer=clickPoints[num-1];	
			console.log("num="+num)
			ns.haloPointer=haloPointer;
			haloPointer.haloCount=0;
			haloPointer.halo=true;
			haloPointer.hideHalo=false;
			
		}
		
		this.hidePointerHalo=function(num){
			
			haloPointer.hideHalo=true;
		}
		
		
		this.setClockTime=function(d,h,m,s,ms,past){
			this.day=d;
			this.hour=h;
			this.minute=m;
			this.second=s;
			this.milisecond=ms;
			
			//スモールポインターの点滅
			nowPointerNum=Math.floor(this.second/(60/smallPointerDiv));
			
			if(activePointerNum!=nowPointerNum){
				activePointerNum=nowPointerNum;
				if(activePointer){
					disActivePointer=activePointer;
					activePointer=smallPoints[nowPointerNum];
					//
					disActivePointer.hide();
					activePointer.show();
				}
			}
			
			
			var date=new Date();
			this.hour=date.getHours();
			this.minute=date.getMinutes();
			this.second=date.getSeconds();
			
			var hString=(this.hour<10)?"0"+this.hour:String(this.hour);
			var mString=(this.minute<10)?"0"+this.minute:String(this.minute);
			var sString=(this.second<10)?"0"+this.second:String(this.second);
			var nowTimeStrs=[];
			
			nowTimeStrs=nowTimeStrs.concat(hString.split(""));
			nowTimeStrs=nowTimeStrs.concat(mString.split(""));
			nowTimeStrs=nowTimeStrs.concat(sString.split(""));
			for(var n=0;n<6;n++){
				var degitalText=degitalTimes[n];
				var nowTimeStr=nowTimeStrs[n];
				
				if(degitalText!=nowTimeStr){
					var targetimg=	degitalImages.eq(n);
					targetimg.attr("src","img/index/nums/num"+nowTimeStr+".png");
					degitalTimes[n]=nowTimeStr;
				}
			}
			
			this.countTimeResio=(past%rotationTime)/rotationTime;
		}
		
		
		
		
		this.drawCircleObj=function(){
		
			context.save();
			context.beginPath();
			context.lineWidth=1;
			context.strokeStyle="#ffffff";
			var startDeg=-Math.PI/2;
			var outerR=drawW*outR1/2;
			
			
			//ポインターの円の描画
			context.arc(halfP.x,halfP.y,outerR,startDeg,startDeg+Math.PI*2);
			context.stroke();
			context.restore();
			
			
			
			//16の小さい円を表示
			
			var pointR0=drawW*0.0127/2/addScaleResio;
			var smallOuterR=drawW*outR3/2;
			
			
			for(var n=0;n<smallPointerDiv;n++){
				var targetSmallPoint=smallPoints[n];
				var smallPointRad=targetSmallPoint.lastPointDeg;
				startP={
					x:smallOuterR*Math.cos(smallPointRad),
					y:-smallOuterR*Math.sin(smallPointRad)
				}
				
				targetSmallPoint.x=startP.x;
				targetSmallPoint.y=startP.y;
				targetSmallPoint.w=targetSmallPoint.h=pointR0;
				targetSmallPoint.drawImage();
			}
			
			//小さい数字を表示
			
			for(var n=0;n<4;n++){
				var targetSn=smallNums[n];
				targetSn.drawImage();
			}
			
			//5つのポインターの描画
			var pointerR=drawW*0.1154/addScaleResio;
			
			for(var n=0;n<pointerDiv;n++){
				var targetPointer=clickPoints[n];
				var pointRad=n*Math.PI*2/pointerDiv-Math.PI/2;
				var startP={
					x:outerR*Math.cos(pointRad),
					y:-outerR*Math.sin(pointRad)
				}
				
				targetPointer.x=startP.x;
				targetPointer.y=startP.y;
				targetPointer.w=targetPointer.h=pointerR;
				targetPointer.drawImage();				
			}
		
		}
		
		function clickPoint(){
			this.prototype=Object;
			this.opacity=1;
			this.x;
			this.y;
			this.w;
			this.h;
			this.R;
			this.img;
			this.scale=1;
			this.linkUrl;
			this.pointRad;
			this.serialNum;
			this.pointerR;
			this.outerR;
			this.startP;
			this.lastPointDeg;
			this.halo;
			this.haloCount;
			
			
			this.adjust1;
			this.adjust2;
			this.adjustCount=0;
			this.clipR=0;
			
			
			this.openPageCount=0;
			this.closePageCount=0;
			
			this.doRegumeTopPageAnime=function(num){
				var limitNum=5*num/pointerDiv;
				var limitResio=pageCloseCountDiv/20;
				if(limitNum<pageCloseCount){
					var changeResio=this.closePageCount/(pageCloseCountDiv-limitNum);
					var nowDeg=this.lastPointDeg+changeResio*Math.PI*4;
					this.scale=Math.pow(changeResio,1);
					this.R=this.outerR*Math.pow(this.scale,1);
					this.x=this.R*Math.cos(nowDeg);
					this.y=-this.R*Math.sin(nowDeg);
					this.closePageCount+=1;
					this.opacity=this.scale;
				}
				
				
				var lastNum=this.serialNum-1;
				
				if(lastNum<0){lastNum+=pointerDiv}
				var nowP=this;
				var lastP=clickPoints[lastNum];
				if(this.R>10 && lastP.R>10){
					
					var nowPoint={
						x:(halfP.x+this.x),
						y:(halfP.y-this.y)
					}
					
					var lastPoint={
						x:(halfP.x+lastP.x),
						y:(halfP.y-lastP.y)
					}
					
					this.drawPointerLine(nowPoint,lastPoint);
					
				}
				
				this.drawImage(false);
				
			}
			
			this.doOpenPageAnime=function(num){
				this.R=this.outerR;
				var limitResio=pageOpenCountDiv/20;
				var limitNum=0;
				
				if(this.serialNum>openpageNum){
					limitNum=(this.serialNum-openpageNum)*limitResio;
				}else if(this.serialNum<openpageNum){
					limitNum=((pointerDiv+this.serialNum)-openpageNum)*limitResio
				}
					
				
				var scaleKey=false;
				if(limitNum<pageOpenCount){
					var changeResio=this.openPageCount/(pageOpenCountDiv-limitNum);
					var nowDeg=this.lastPointDeg-changeResio*Math.PI*2;
					this.scale=(1-changeResio);
					if(this.serialNum==openpageNum-1){scaleKey=true}
					this.R*=Math.pow(this.scale,2);
					this.x=this.R*Math.cos(nowDeg);
					this.y=-this.R*Math.sin(nowDeg);
					if(scaleKey){
						if(pageOpenCount<pageOpenCountDiv-10){
							this.scale=1;
						}else{
							this.scale=1-(pageOpenCount-(pageOpenCountDiv-10))/10;
						};
					}
					this.openPageCount+=1;
				}else{
					var nowDeg=this.lastPointDeg;
					this.x=this.R*Math.cos(nowDeg);
					this.y=-this.R*Math.sin(nowDeg);
				}
				var lastNum=this.serialNum+1;
				if(lastNum>=pointerDiv){lastNum-=pointerDiv}
				
				if((this.serialNum!=openpageNum-1 && openpageNum!=0)||(openpageNum==0 &&this.serialNum!=4)){
					
					var nowP=this;
					var lastP=clickPoints[lastNum];
					
					var nowPoint={
						x:(halfP.x+this.x),
						y:(halfP.y-this.y)
					}
					var lastP=clickPoints[lastNum];
					var lastPoint={
						x:(halfP.x+lastP.x),
						y:(halfP.y-lastP.y)
					}
					
					this.drawPointerLine(nowPoint,lastPoint);
					
				}
				
				this.opacity=this.scale;
				this.drawImage(scaleKey);
				
			}
			
			this.doOpeningAnime=function(){
				this.pointerR=drawW*0.1154/addScaleResio;
				this.outerR=drawW*outR1/2;
				this.pointRad=this.serialNum*Math.PI*2/pointerDiv-Math.PI/2;
				var nowDeg=this.pointRad-cpAddDeg*(1-spNowCountResio);
				//if(this.serialNum==2)
			
				if(nowDeg>5*Math.PI/2){
					//最初平行移動で入ってくる
				
					
					this.R=Math.sqrt(Math.pow(l1,2)+Math.pow(l2,2));
				}else{
					this.R=this.outerR;
					this.R=Math.sqrt(Math.pow(l1,2)+Math.pow(l2,2));
					//nowDeg=Math.PI;
				}
				var l1=this.outerR;
				var l2=Math.tan(nowDeg-Math.PI)*l1;
				this.R=Math.sqrt(Math.pow(l1,2)+Math.pow(l2,2));
				
				this.R=this.outerR/2+(canvasW/2-this.outerR)*(cpAnimeResio);
				if(this.R<this.outerR){
					this.R=this.outerR;
				}
				
				this.x=this.R*Math.cos(nowDeg);
				this.y=-this.R*Math.sin(nowDeg)*(Math.pow(1-cpAnimeResio,2));
	
				this.w=this.h=this.pointerR;
				var startP={
					x:(halfP.x+this.x-this.w*this.scale/2)/this.scale,
					y:(halfP.y-this.y-this.h*this.scale/2)/this.scale
				}
				return {x:startP.x+this.w/2,y:startP.y+this.h/2};
			}
			
			this.drawImage=function(scaleKey){
				if(this.halo && this.serialNum>2){
					this.haloCount+=1;
					var haloDiv=20;
					if(this.haloCount>haloDiv){
						this.halo=false;
						haloPointer=null;
						this.haloCount=haloDiv;
					}
					context.save();
					context.beginPath();
					var centerP={
						x:halfP.x+this.x,
						y:halfP.y-this.y
					}
					//var resio=
					var lineR=(this.w/2-2)*(1+this.haloCount*0.05);
					var alpha=Math.pow(1-this.haloCount/haloDiv,0.7);
					context.lineWidth=3*alpha;
					context.strokeStyle="rgba(255,255,255,"+alpha+")";
					context.arc(centerP.x,centerP.y,lineR,0,Math.PI*2);
					context.stroke();
					context.restore();
				}
				
				context.save();
				context.beginPath();
				context.strokeStyle="#ffffff";
				context.globalAlpha =this.opacity;
				//if(!scaleKey){
					context.scale(this.scale,this.scale);
				//}
				var startP={
					x:Math.round((halfP.x+this.x-this.w*this.scale/2)/this.scale),
					y:Math.round((halfP.y-this.y-this.h*this.scale/2)/this.scale)
				}
				
				var endP={
					x:Math.round(startP.x+this.w),
					y:Math.round(startP.y+this.h)
				};
				
				
				context.drawImage(this.img,startP.x,startP.y,endP.x-startP.x,endP.y-startP.y);
				
				if(this.halo&& this.serialNum<3){
					//this.haloCount+=1;
					var zoomDiv=25;
					var delayCount=5;
					if(topClose){
						this.haloCount-=3;
						if(this.haloCount<0){
							this.haloCount=0;
							ns.haloPointer=null;
							haloPointer=null;
							context.restore();
							this.halo=false;
							hideHalo=false;
							return;
						}
						
					}else if(haloPointer.hideHalo){
						this.haloCount-=1;
						if(this.haloCount<0){
							this.haloCount=0;
							ns.haloPointer=null;
							haloPointer=null;
							context.restore();
							this.halo=false;
							return;
						}
					}else{
						this.haloCount+=1;
						if(this.haloCount>zoomDiv){
							this.haloCount=zoomDiv;
						}
					}
					var mainImage=ns.mouseOverImages[this.serialNum][0];
					var textImage=ns.mouseOverImages[this.serialNum][2];
					var imageR=this.w*2.65;
					
					startP={
						x:(halfP.x+this.x-imageR*this.scale/2)/this.scale,
						y:(halfP.y-this.y-imageR*this.scale/2)/this.scale
					}
					
					var endP={
						x:startP.x+imageR,
						y:startP.y+imageR
					};
					var clipRecio=Math.pow(this.haloCount/(zoomDiv-delayCount),0.25);
					if(haloPointer.hideHalo){
						clipRecio=Math.pow(this.haloCount/(zoomDiv-delayCount),2);
					}
					if(clipRecio>1){clipRecio=1}
					this.clipR=clipRecio*imageR/2;
					//
					context.beginPath();
					context.strokeStyle="#ff0000";
					
					var centerP={
						x:(halfP.x+this.x)/this.scale,
						y:(halfP.y-this.y)/this.scale
					}
					context.arc(centerP.x,centerP.y,this.clipR,0,Math.PI*2,false);
					context.clip();
					//context.stroke();	
					context.drawImage(mainImage,startP.x,startP.y,endP.x-startP.x,endP.y-startP.y);
					context.beginPath();
					context.restore();
					
					var delayResio=1.2;
					if(this.haloCount>delayCount*delayResio){
						var alpharesio=(this.haloCount-delayCount*delayResio)/(zoomDiv-delayCount*delayResio);
						if(haloPointer.hideHalo){
							context.globalAlpha=Math.pow(alpharesio,2);
						}else{
							context.globalAlpha=Math.pow(alpharesio,0.5);
						}
						//trace2("context.grobalAlpha="+context.globalAlpha);
						context.beginPath();
						var originW=(this.serialNum==0)?343:334;
						var originH=(this.serialNum==0)?165:170;
						var textW=(this.serialNum==0)?this.w*6.35:this.w*6.18;
						var textH=(this.serialNum==0)?this.w*2.314:this.w*2.41;
						textW*=0.76;
						textH*=0.76;
						var sx=0;
						var sy=40;
						var sw=originW;
						var sh=originH-sy;
						var dx=(halfP.x+this.x-textW*this.scale/2)/this.scale;
						var dy=(halfP.y-this.y-textH*this.scale/1.5)/this.scale+this.w*(Math.pow(1-alpharesio,3));
						if(haloPointer.hideHalo){
							dy=(halfP.y-this.y-textH*this.scale/1.5)/this.scale+this.w*(Math.pow(1-alpharesio,0.5));
						}
						context.drawImage(textImage,sx,sy,sw,sh,dx,dy,textW,textH);
					}
					
					
					
					
					
				}
				context.restore();
				//return {x:startP.x+this.w/2,y:startP.y+this.h/2};
			}
			
			this.drawPointerLine=function(np,lp){
				var Rresio=0;
				
				var inclination1=1/geometry.getR(halfP,np);
				var inclination2=1/geometry.getR(halfP,lp);
				var line1=new geometry.line(np,inclination1);
				var line2=new geometry.line(lp,inclination2);
				var crossP0=geometry.getCrossPoint(line1,line2);
				/*console.log("spNowCountResio="+spNowCountResio)*/
				if(spNowCountResio>0.5){
					this.adjustCount=(1-spNowCountResio)/0.5;
					Rresio=Math.sin(this.adjustCount*Math.PI);
				}
				var adjust1=0.96;
				this.adjust1=adjust1+Rresio*0.05;
				var tpX=(crossP0.x-halfP.x)*this.adjust1;
				var tpY=(crossP0.y-halfP.y)*this.adjust1;
				var crossP={x:halfP.x+tpX,y:halfP.y+tpY}
				
				var adjust2=1.01;
				var npX=halfP.x+(np.x-halfP.x)*adjust2;
				var npY=halfP.y+(np.y-halfP.y)*adjust2;
				var lpX=halfP.x+(lp.x-halfP.x)*adjust2;
				var lpY=halfP.y+(lp.y-halfP.y)*adjust2;
				
				context.save();
				context.beginPath();
				context.lineWidth=1;
				context.strokeStyle="#ffffff";
				context.moveTo(npX,npY);
				context.quadraticCurveTo(crossP.x,crossP.y,lpX,lpY);
				context.stroke();
				context.restore();
			}
			
		}
		
		function smallPoint(){
			this.prototype=Object;
			this.serialNum;
			this.opacity=0.5;
			this.x;
			this.y;
			this.w;
			this.h;
			this.R;
			this.lastPointDeg;
			this.scale={x:1,y:1};
			
			this.active=false;
			var activeDiv=30;
			var activeR=0;
			var maxActiveR=8.5;
			var activeCount=0;
			this.yuragiResio;
			
			var activeOpacity;
			this.disactive=false;
			this.openPageCount=0;
			this.closePageCount=0;
			
			var l1;
			var moveResio;
			var addDeg;
			var nowDeg;
			var dagResio;
			
			this.doRegumeTopPageAnime=function(num){
				l1=drawW*outR3/2;
				nowDeg=this.lastPointDeg;
				this.R=	l1*0;
				var limitNum=5*num/pageCloseCountDiv;
				if(limitNum<pageCloseCount){
					this.closePageCount+=1;
					dagResio=this.closePageCount/(pageCloseCountDiv-limitNum)
					moveResio=Math.pow(dagResio,Math.pow(10/(num+1),0.3));
					addDeg=-dagResio*Math.PI*4;
					this.R=l1*Math.pow(moveResio,1.8);
					nowDeg=this.lastPointDeg+addDeg;
				}else{
					dagResio=0;
				}
				
				this.x=this.R*Math.cos(nowDeg);
				this.y=this.R*Math.sin(nowDeg);
				var startP={
						x:(halfP.x+this.x)/this.scale.x,
						y:(halfP.y-this.y)/this.scale.y
				}
				this.opacity=dagResio;
				
				var w=this.w*(dagResio);
				context.save();
				context.beginPath();
				context.fillStyle="#ffffff";
				context.globalAlpha=this.opacity;
				context.arc(startP.x,startP.y,w,0,Math.PI*2);
				context.fill();
				context.closePath();
				context.restore();
			}
			
			this.doOpenPageAnime=function(num){
				l1=drawW*outR3/2;
				//var moveResio=0;
				//var addDeg=0;
				nowDeg=this.lastPointDeg;
				//var dagResio=1;
				this.R=	l1;
				var limitNum=10*num/pageOpenCountDiv;
				if(limitNum<pageOpenCount){
					this.openPageCount+=1;
					dagResio=this.openPageCount/(pageOpenCountDiv-limitNum)
					moveResio=Math.pow(1-dagResio,Math.pow(10/(num+1),0.4));
					addDeg=dagResio*Math.PI*2;
					this.R=l1*(moveResio);
					nowDeg=this.lastPointDeg+addDeg;
				}else{
					dagResio=1;	
				}
				this.opacity=dagResio;
				this.x=this.R*Math.cos(nowDeg);
				this.y=this.R*Math.sin(nowDeg);
			
				var startP={
						x:(halfP.x+this.x)/this.scale.x,
						y:(halfP.y-this.y)/this.scale.y
				}
				
				var w=this.w*(1-dagResio);
				context.save();
				context.beginPath();
				context.fillStyle="#ffffff";
				context.globalAlpha=this.opacity;
				context.arc(startP.x,startP.y,w,0,Math.PI*2);
				context.fill();
				context.closePath();
				context.restore();
			}
			
			
			this.doOpeningAnime=function(){
				
				var nowDeg=this.lastPointDeg+spAddDeg*(1-spNowCountResio);
				
					
					var l1=drawW*outR3/2;
					
					if(	spNowCount>=30){
						var resio=Math.pow(spNowCount/spOpeneingAnimeDiv,2);
						this.R=	l1*Math.pow(spNowCountResio,1)+resio*(canvasW-l1);
					}else{
						this.R=	l1;
					}
					//this.R=	l1
					if(spOpeneingAnimeCount>spYuragiMax){
						
						this.yuragiResio=(spYuragiMax*2-spOpeneingAnimeCount)/spYuragiMax;
						
						if(this.yuragiResio<0){
							this.yuragiResio=0;
						}
					}else{
						this.yuragiResio=1;
					}
					//this.yuragiResio=1;
					/*if(this.serialNum==0 &&spOpeneingAnimeCount>50){
						trace("this.R="+this.R+",spNowCount="+spNowCount)
					}
				/*}*/
				
				this.x=this.R*Math.cos(nowDeg);
				this.y=this.R*Math.sin(nowDeg)*spOpeningScaleY+100*Math.pow(Math.sin(this.serialNum),1)*this.yuragiResio;
				var startP={
						x:(halfP.x+this.x)/this.scale.x,
						y:(halfP.y-this.y)/this.scale.y
				}
				context.save();
				context.beginPath();
				context.fillStyle="#ffffff";
	
				context.arc(startP.x,startP.y,this.w,0,Math.PI*2);
				context.fill();
				context.closePath();
				context.restore();
				//}
			}
			
			this.drawImage=function(){
				context.save();
				context.beginPath();
				
				context.scale(this.scale.x,this.scale.y);
				var startP={
						x:(halfP.x+this.x)/this.scale.x,
						y:(halfP.y-this.y)/this.scale.y
				}
				if(this.active){
					
					activeR=activeCount/activeDiv;
					activeOpacity=this.opacity*(1-activeR);
					context.fillStyle="rgba(255,255,255,"+activeOpacity+")";
					context.arc(startP.x,startP.y,this.w*maxActiveR*activeR,0,Math.PI*2);
					context.fill();
					context.closePath();
					if(activeDiv<=activeCount){
						if(this.disactive){
							this.active=false;
						}else{
							activeCount=0;
							activeR=0;
						}
					}else{
						activeCount+=1;
					}
				};
				context.beginPath();
				context.fillStyle="#ffffff";
				
				context.arc(startP.x,startP.y,this.w,0,Math.PI*2);
				
				context.fill();
				context.closePath();
				context.restore();
			}
			
			this.show=function(){
				this.active=true;
				this.disactive=false;
				activeR=0;
				activeCount=0;
			}
			this.hide=function(){
				this.disactive=true;
				this.active=false;
			}
			/*this.repeat=function(){
				this.showCount+=1;
			}*/
		}
		
		function clockNeadle(){
			this.prototype=Object;
			this.R;
			this.moveR=0;
			this.serialNum;
			this.rotation=0;
			this.nowDeg=0;
			this.endDeg;
			this.startP={x:0,y:0};
			this.endP={x:0,y:0};
			this.scale=1;
			this.gageH=drawW*0.028*this.scale;
			
			this.openPageCount=0;
			this.closePageCount=0;
			this.opacity=1;
			
			var limitNum;
			var changeResio
			
			this.doRegumeTopPageAnime=function(num){
				
				//数が多いと渦巻き状になる
				limitNum=2*num/clockDiv;
				
				if(pageOpenCount>limitNum){
					changeResio=this.closePageCount/(pageCloseCountDiv-limitNum);
				
					if(changeResio>1){changeResio=1}
					this.scale=Math.pow((changeResio),1.5);
					//this.scale*=0.3+0.7*(this.serialNum/clockDiv)
					this.R=cnR*Math.pow(this.scale,2);
					//this.R*=(this.serialNum/clockDiv);
					this.closePageCount+=1.1;
					this.nowDeg=pageCloseResio*Math.PI*2-(changeResio)*Math.PI*4;
					this.rotation=(1-Math.pow(changeResio,0.5))*Math.PI*2;
					this.rotation*=(0.5+Math.random()*0.5);//角度にバラツキを付ける
					this.opacity=Math.pow(this.scale,3);
					this.nowDeg*=Math.pow(0.7+Math.random()*0.3,(1-changeResio));
					
					//テスト出力
					//if(this.serialNum==1 &&this.closePageCount>20){
						//trace("changeResio="+changeResio)
					//}
					
					this.drawImage();
				}
			}
			
			this.doOpenPageAnime=function(num){
				this.R=cnR;
				
				
				limitNum=10*num/clockDiv;
				
				if(pageOpenCount>limitNum){
					changeResio=this.openPageCount/(pageOpenCountDiv-limitNum);
					if(changeResio>1){changeResio=1}
					this.scale=Math.pow((1-changeResio),2);
					
					this.R=cnR*Math.pow(this.scale,1.5)
					this.openPageCount+=1.2;
					this.nowDeg=pageOpenResio*Math.PI*2+(changeResio)*Math.PI*2;
					this.rotation=(changeResio)*Math.PI*2;
					if(this.rotation>Math.PI/2){
						this.rotation=Math.PI/2;
					}
				}else{
					this.scale=1;
					this.nowDeg=pageOpenResio*Math.PI/2;	
				}
				this.nowDeg*=Math.pow(Math.random(),(changeResio));
				this.opacity=this.scale;
				this.drawImage();
			}
			
			this.doOpeningAnime=function(){
				this.R=cnR;
				
				//cnAnimeResio:1->0;
				//cnAnimeResio2:最後5カウントぐらいで20->-1に劇的変化
				//cnAnimeResio3:1->0イージング付き
			
				//cnEffectChange=false
			
				//if(!cnEffectChange){
					this.opacity=0.5;
					this.moveR=(canvasW-this.R)*(Math.pow(cnAnimeResio2,4))*Math.pow((this.serialNum+1)/10,0.2);
					
					this.nowDeg=Math.pow(Math.PI*3*cnAnimeResio,1)*Math.pow((spOpeneingAnimeDiv-this.serialNum+10)/10,cnAnimeResio);
					this.scale=(1+cnAnimeResio*2)*Math.abs(1+cnAnimeResio3);
					
					
					
					if(cnAnimeResio<0.6){
							//this.scale*=0.5+0.5*(1-this.serialNum/clockDiv);
							if(cnAnimeResio<0.4){
								//this.nowDeg*=Math.random();
								//this.scale*=Math.pow(cnAnimeResio,0.5);
							}
							//両方かけると結構劇的
							//this.R*=(1-this.serialNum/clockDiv);
							//this.moveR*=(1-this.serialNum/clockDiv);
					}
				/*}else{
					this.opacity=1-0.5*cnAnimeResio3;
					
					
					this.moveR=-Math.abs(cnAnimeResio3*10)*(this.R);
					this.nowDeg=Math.pow(Math.PI*3*cnAnimeResio,1);
					this.scale=(1+cnAnimeResio3)*Math.abs(Math.pow(cnAnimeResio2,5));
				}
				*/
				if(this.serialNum==1 &&spOpeneingAnimeCount>50){
					//trace("cnAnimeResio2"+cnAnimeResio2)
					//trace("cnAnimeResio3="+cnAnimeResio3+",this.scale="+this.scale+",this.nowDeg="+this.nowDeg+",this.endDeg="+this.endDeg)
				}
				
				//バラツキの演出
				this.moveR*=0.03*cnAnimeResio*(Math.random());
				this.rotation=-Math.PI/2*cnAnimeResio*(0.5+Math.random()*0.5);
				//this.rotation=0;//0になるとノーマル
			
				this.drawImage();
			}
			
			this.drawImage=function(){
				context.save();
				context.strokeStyle="#ffffff";
				context.lineWidth=1;
				context.beginPath();
				context.globalAlpha=this.opacity;
				this.gageH=drawW*0.028*Math.pow(this.scale,0.5);
				var rad=this.endDeg-this.nowDeg;
				var startRad=rad+this.rotation;//*yResio;
				//startRad=this.rotation;
				//ここ切り替えると劇的に変化
				//var startRad=(rad+this.rotation)*yResio;
				var endR=(this.R+this.moveR)*this.scale;
				var startR=endR-this.gageH;
			
				
				var endP={
					x:halfP.x+Math.cos(rad)*(endR),
					y:halfP.y+Math.sin(rad)*(endR)//*cnYResio
				}
				var startP={
					x:endP.x-Math.cos(startRad)*this.gageH,
					y:endP.y-Math.sin(startRad)*this.gageH
				}
				
				
				context.moveTo(startP.x,startP.y);
				context.lineTo(endP.x,endP.y);
				context.stroke();
				context.restore();
			}
		}
		
		function smallNumObj(){
			this.prototype=Object;
			this.serialNum=n;
			this.x;
			this.y;
			this.w=16;
			this.h=12;
			this.deg;
			this.showCount=0;
			this.img;
			this.drawImage=function(){
				context.save();
			
				context.globalAlpha=this.showCount/10;
				if(this.showCount<10){
					this.showCount+=1;
				}
				
				this.w=drawW*0.0255/addScaleResio;
				this.h=drawW*0.019/addScaleResio;
				var R=(contentOriginW/2-this.w/2)/addScaleResio*contentScaleResio;;
				this.x=halfP.x+(R*Math.cos(this.deg)-this.w/2);
				this.y=halfP.y+(R*Math.sin(this.deg)-this.h/2);
				
				context.drawImage(this.img,this.x,this.y,this.w,this.h);
				
				context.restore();
			}
		}
		
		this.drawBox=function(centerP){
			/*context.save();
	
			context.strokeStyle="#ffffff";
			context.lineWidth=1;
			context.beginPath();
			contentScaleResio=1;*/
			contentMarginX=contentMarginY=0;
			
			halfP={x:canvasW/2,y:canvasH/2};
		
			if(utils.Browser=='iPhone'&&!utils.android){
				halfP.y-=5;
			}
			ns.halfP=halfP;
			
			if(utils.pc){
				if(winW<contentOriginW || winH<contentOriginH){
					var VHResio=winH/winW;
					if(VHResio<contentsVHResio){
						contentScaleResio=winH/contentOriginH;
					}else{
						contentScaleResio=winW/contentOriginW;
					}
					
				}
				
			ns.contentW=contentOriginW*contentScaleResio;
			ns.contentH=contentOriginH*contentScaleResio;
			
			
			}else{
				//contentScaleResio=1//初期値;
				contentScaleResio=1.1//addScaleResio;
				if(ns.yoko){
				
					contentScaleResio*=0.8//addScaleResio;
					if((openEnd&&!changeEnd)&&(!topClose &&!topOpen)){
						
						//ページ表示のとき
						contentScaleResio=0.65;
					}
				}
				
				ns.contentW=contentOriginW*contentScaleResio/canvasScaleResio;
				ns.contentH=contentOriginH*contentScaleResio/canvasScaleResio;
				
			}
			
			contentMarginX=-(ns.contentW-winW)/2;
			contentMarginY=-(ns.contentH-winH)/2;
			
			//ずれの調整
			if(utils.sp){
					if(utils.android){
						if(!ns.yoko){
							
							contentMarginX+=2;
						}else{
							contentMarginX+=1;
						}
							contentMarginY+=2;
					}else{
						//contentMarginX+=2;
						if(ns.yoko){
							contentMarginY+=1;
							contentMarginX+=1;
						}else{
							//contentMarginY-=1;
						}
					}
				
			}else if(utils.tablet){
					if(!utils.android){
						contentMarginX+=2;
						if(ns.yoko){contentMarginY-=1;}else{contentMarginY-=3;}
					}
			}
			
			ns.content.css({
				"width":ns.contentW,
				"height":ns.contentH,
				"left":contentMarginX,
				"top":contentMarginY
			});
			
			ns.pagesBox.css({
				"width":ns.contentW,
				"height":ns.contentH,
				"left":contentMarginX,
				"top":contentMarginY
			});
			
			ns.pageChangeDrawBox(ns.contentW,ns.contentH,contentMarginX,contentMarginY);
			
			drawW=contentOriginW*contentScaleResio;
			drawH=contentOriginH*contentScaleResio;
			ns.drawW=drawW;
			ns.drawH=drawH;
			
		
			
		}
		
		
		
		
		this.drawClock=function(){
			
			
			var rad=Math.PI*2*this.countTimeResio;
		
			context.save();
			
			context.beginPath();
			context.lineWidth=1;
			context.strokeStyle="#ffffff";
			
			var R=drawW*outR2/2;
			
			var bandDiv=5;
			var upH=drawW*0.01277/addScaleResio;
			var clockGageH=drawW*0.028/addScaleResio;
			
			var startN=Math.round(clockDiv*rad/(Math.PI*2));
			
			var befor1=checkNum(startN-1);
			var befor2=checkNum(startN-2);
			var befor3=checkNum(startN-3);
			var befor4=checkNum(startN-4);
			var after1=checkNum(startN+1);
			var after2=checkNum(startN+2);
			var after3=checkNum(startN+3);
			var after4=checkNum(startN+4);
			for(var n=0;n<clockDiv;n++){
				var rad=(n*Math.PI*2)/clockDiv-Math.PI/2;
				var startR=R-clockGageH;
				var endR=R;
				if(n==startN){
					endR+=upH;
				}else if(n==befor1||n==after1){
					endR+=upH*0.812;
				}else if(n==befor2||n==after2){
					endR+=upH*0.562;
				}else if(n==befor3||n==after3){
					endR+=upH*0.25;
				}else if(n==befor4||n==after4){
					endR+=upH*0.0625;
				}
				
				var startX=halfP.x+Math.cos(rad)*(startR);
				var startY=halfP.y+Math.sin(rad)*(startR);
				
				
				var endX=halfP.x+Math.cos(rad)*(endR);
				var endY=halfP.y+Math.sin(rad)*(endR);
				context.moveTo(startX,startY);
				context.lineTo(endX,endY);
			}
			
			context.stroke();
			context.restore();
		
		
		
		}
		
		var count=0;
		var crossP;
		var inclination1;
		var inclination2;
		var line1;
		var line2;
		
		
		function checkNum(num){
			if(num<0){
				num+=clockDiv;
			}else if(num>=clockDiv){
				num=0;
			}
			return num;
		}
		
		function checkInSize(p){
			if(p.x<0){p.x=0;}	
			if(p.y<0){p.y=0;}
			if(p.x>canvasW){p.x=canvasW;}
			if(p.y>canvasH){p.y=canvasH;}
			return p;
		}
	
			
		
	}
	
	function setFontSize(){
		
		var size=Math.round(100*ns.contentW/contentOriginW)/100;
		
		$("#wrapper").css("font-size",size+"em");
	}
	
	
})(ns)

var geometry={
	getR:function(p1,p2){
		var inclination=-(p2.y-p1.y)/(p2.x-p1.x);
		return inclination;
	},
	line:function(p1,inc){
		this.prototype=Object;
		this.a=inc;
		this.b=p1.y-this.a*p1.x;
		this.x=p1.x;
		this.y=p1.y;
	},
	
	getCrossPoint:function(line1,line2){
		var px,py;
		var a1=line1.a;
		var b1=line1.b;
		var a2=line2.a;
		var b2=line2.b;
	
		
		if(a1-a2==0){
			px=line1.x+(line2.x-line1.x)/2;
			py=line1.y+(line2.y-line1.y)/2;
		}else if(Math.abs(a1)==Infinity){
			
			px=line2.x;
			py=a2.x+b2;
		}else if(Math.abs(a2)==Infinity){
			
			px=line1.x;
			py=a1.x+b1;
		}else{
			px=-(b1-b2)/(a1-a2);
			py=a1*px+b1;
		}
	
		return {x:px,y:py}
		
	}
}
