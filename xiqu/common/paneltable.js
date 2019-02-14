var call_keydownfun = "";  //键盘按键分派
var call_mocusFun = ""; //鼠标右键分派
var statusChange = 1;  //遥控鼠标状态切换，1为遥控，2为鼠标
var uid ='';// 2425384;//5214564//20111017000001
var urls="http://"+window.location.hostname;
if(urls=="http://localhost"){urls="http://localhost/home"}

function ImagePanelTable(){
	this.panelArray = new Array(); //存储panel类别
	this.currentIndex = 0;//当前
	this.panelData=new Array();//保存数据
	this.perloadNumber = 3;//默认加载三页
	this.nextAddNumber = 1; //每次添加的页数
	this.lastNumber = this.perloadNumber //添加的总数，默认为初始化加载的个数
	this.leftLastNumber = 1;
	this.intervalNum = 1; //间隔加载数
	this.playtime = 0.5;
	this.width = 0;
	this.height = 0;
	this.imgnum = 0; //进入的当前图片
	this.panelPage="";
	this.screen = 0;  //总屏数
	
	this.nowimgnum = 0; //当前页面显示的图片个数
	this.allimgnum = 7; //页面图片个数的最大容量
	this.leftnum = 0; //最左边的一张图片
	this.rightnum = this.allimgnum; //最右边的一张图片
	this.isaddimg = true;
	this.paneltype = 0;
	this.dotStatu = 1;  //豆单是否获得焦点，1为默认无焦点，2为获得焦点
	this.preId = 0;  //当前豆单id
	this.SetIntClock = false; //键盘开关
}

/*
	初始化动态创建panel容器 
	searchObj.option = {
		init:初始化函数,
		creatstartnumber:创建的dom起始ID号,
		createndnumber:创建的dom结束ID号,
		parentId:"创建dom的父类ID"
		domtype:"创建的dom类型"
	}
*/
ImagePanelTable.prototype.init=function(datacallfun){
	this.paneltype = datacallfun.paneltype;
	var width = datacallfun.width;
	var height = datacallfun.height;
	var imgnum = datacallfun.imgnum;
	var _this = this;	
	//document.body.addEventListener("click",function(){_this.infomationOperate(_this,panelId)},true);
	//document.body.addEventListener("mousemove",function(){_this.infomationOperate(_this,panelId)},true);
	if(width){
		this.width = width;
	} 
	if(height){
		this.height = height;
	}
	if(datacallfun){
		/* if(data){
			this.panelData = data;
		}else{
			this.panelPage=panel;
			this.panelData = this.loadXML(panelId,actionURL);
		} 
		
		//alert(this.screen);
		if(!this.panelData){
			return;
		}*/
		var jsonlen =datacallfun.jsonlen;
		if(jsonlen > 0 ){
			//$(panelId).style.width = "100000px"; //宽度由各自自己计算
			if(imgnum){
				this.perloadNumber = this.perloadNumber + imgnum - 1;
				this.lastNumber = this.perloadNumber;
				if(imgnum-3 < 0){
					this.imgnum = 0;
				}else{
					this.imgnum = imgnum-2;  //用于加载数据的起始值
				}
				this.leftLastNumber = this.imgnum;
				this.leftnum = this.imgnum - 1;
			}
			//if(screenNum){
				this.screen = datacallfun.allNumber;
				if(this.lastNumber > this.screen){
					this.lastNumber = this.lastNumber - this.screen -1;
				}
			//}
			
			var panelDiv = "";
			for(var i = 1; i <= this.perloadNumber; i++){
				//panelDiv = $(panelId).innerHTML;
				panelDiv += "<"+datacallfun.domtype+" id='"+datacallfun.parentId+"_"+i+"'></"+datacallfun.domtype+">";
			}
			$(datacallfun.parentId).innerHTML = panelDiv;
			 if(imgnum){
				$(datacallfun.parentId).style.marginLeft = -width * (imgnum - 1) + "px";
			} 
			this.panelArray = datacallfun;
			for(var i = 1; i <= this.perloadNumber; i++){
				datacallfun.init(i);
			}
			if(imgnum){
				this.nowimgnum = this.perloadNumber - this.imgnum + 1;
			}else{
				this.nowimgnum =  this.perloadNumber;
			}
			this.beanDot();
			//alert(this.perloadNumber + "a" + this.imgnum);
			//alert(this.nowimgnum);
		}
	}
	/* var innerstr = "";
	for(var i =datacallfun.creatstartnumber; i <=datacallfun.createndnumber; i++){
		innerstr += "<"+datacallfun.domtype+" id='"+datacallfun.parentId+"_"+i+"'></"+datacallfun.domtype+">";
	}
	$(datacallfun.parentId).innerHTML = innerstr;
	datacallfun.init(); */
}

/*
	向右加载
*/
ImagePanelTable.prototype.rightMove = function(panelId){
	if(this.screen && this.lastNumber == this.screen+1 ){
		this.lastNumber = 1;
	}
	if(this.panelArray.sta == "right"){
		var last = this.screen + 1;
	}else{
		var last = this.screen;
	}
	if(!$(panelId+"_"+(this.lastNumber+1)) && this.lastNumber+1 <= last){
		this.isaddimg = true;
		
		var dom = document.createElement(this.panelArray.domtype);
		dom.id = panelId+"_"+(this.lastNumber+1);
		$(panelId).appendChild(dom);
		
		this.lastNumber = this.lastNumber + this.nextAddNumber;
		this.rightnum = this.lastNumber;
		// if(this.leftnum < this.leftLastNumber){
			// this.leftnum = this.leftLastNumber;
		// }
		
		this.panelArray.init(this.lastNumber);
		
	} else if($(panelId+"_"+(this.lastNumber+1)) && $(panelId+"_"+(this.lastNumber+1)).innerHTML==""  ){
		this.lastNumber = this.lastNumber + this.nextAddNumber;
		this.panelArray.init(this.lastNumber);
		//this.isaddimg = true;
	} 
}

/*
	向左加载
*/
ImagePanelTable.prototype.leftMove = function(panelId){
}
/*
	操作当前对象，左右
*/
ImagePanelTable.prototype.moveStart=function(type,nextId,sta){
	this.SetIntClock = true;
	this.isaddimg = false;
	var scrollIdArray = nextId.split("_");
	var nextObj = $(scrollIdArray[0]);
	var preMargin = 0;
	if(nextObj.style.marginLeft){
		preMargin = parseInt(nextObj.style.marginLeft);
	}
	nextObj.style.webkitTransitionDuration = this.playtime + "s";
	//nextObj.style.webkitTransitionTimingFunction="ease-out";
	nextObj.style.webkitTransitionTimingFunction="cubic-bezier(0,0,0,1)";
	if(type == "left"){
		nextObj.style.marginLeft = preMargin + parseInt($(nextId).offsetWidth) + "px";
	}else if(type == "right"){
		nextObj.style.marginLeft = preMargin - parseInt($(nextId).offsetWidth) + "px";
	}
	var lastNumber = this.lastNumber;
	var leftLastNumber = this.leftLastNumber;
	var intervalNum = this.intervalNum;
	var rightMove = this.rightMove;
	var leftMove = this.leftMove;
	var _this = this;
	this.dotMoveStart(type,scrollIdArray[0]+"_"+scrollIdArray[1]+"_dot");
	setTimeout(function(){
		_this.SetIntClock = false;
		if(_this.panelArray.changePage){
			_this.panelArray.changePage($(nextId));
		}
		/*if(_this.dotStatu == 1 && _this.panelArray.getFocus){
			_this.panelArray.getFocus();
		}*/
		if(type == "left" && scrollIdArray[1] == leftLastNumber + intervalNum && leftLastNumber > 1){
			leftMove.call(_this,scrollIdArray[0]);
		}
		//alert( scrollIdArray[1] + "aaa" +(lastNumber - intervalNum));
		if(type == "right" /* && scrollIdArray[1] == lastNumber - intervalNum */){
			rightMove.call(_this,scrollIdArray[0]);
			
		}
		if(_this.paneltype == "change"){
			_this.changeImg.call(_this,type,nextId);
		}
		if(sta && sta == "right"){
			nextObj.style.webkitTransitionDuration ="0s";
			nextObj.style.marginLeft = 0;
			_this.changeImg.call(_this,type,nextId);
		}
		
	},this.playtime * 1000);
}
ImagePanelTable.prototype.dotMoveStart=function(type,nextId){
	var nextArray = nextId.split("_");
	var nextNum = parseInt(nextArray[1]);
	$("dot").style.webkitTransitionDuration = this.playtime + "s";
	var preMargin = 0;
	if($("dot").style.marginLeft){
		preMargin = parseInt($("dot").style.marginLeft);
	}
	var _this = this;
	if(type=="right"){
		if((nextNum-1)%7 == 0){
			$("dot").style.marginLeft = preMargin - 224;
			setTimeout(function(){_this.dotGoTo(nextId);},_this.playtime * 1000);
		}else{
			this.dotGoTo(nextId);
		}
		
	}else if(type == "left"){
		if((nextNum)%7 == 0){
			$("dot").style.marginLeft = preMargin + 224;
			setTimeout(function(){_this.dotGoTo(nextId);},_this.playtime * 1000);
		}else{
			this.dotGoTo(nextId);
		}
	}
	
}
/*
	动态增删模块数据使界面始终保持一定量的数据
*/
ImagePanelTable.prototype.changeImg = function(type,nextId){
	var nextArray = nextId.split("_");
	if(this.panelArray.sta == "right"){
			var last = this.screen + 1;
		}else{
			var last = this.screen;
		}
	if(type == "right" && this.screen ){
		if(this.nowimgnum < this.allimgnum && this.isaddimg){
			this.nowimgnum++;
		}else if(this.nowimgnum == this.allimgnum){
			if(parseInt(nextArray[1]) >= (this.rightnum-2) % (last)){
				if(!this.isaddimg){
					this.rightnum++;
					this.leftnum++;
				}else{
					this.leftnum++;
				}
				
				var right = this.rightnum % (last)==0 ? last :this.rightnum % (last);
				var left = this.leftnum % (last)==0 ? last :this.leftnum % (last);
				this.panelArray.changedom(left,right,type,this.isaddimg);
			}
			
			
		}
	}else if(type=="left" && this.screen ){
		//alert(this.nowimgnum +"ff"+this.allimgnum + "gg"+this.leftnum % this.allimgnum);
		if(this.nowimgnum < this.allimgnum && this.isaddimg){
			this.nowimgnum++;
		}else if(this.nowimgnum == this.allimgnum ){
			//alert(parseInt(nextArray[1]) + "aaa" + this.leftnum % last);
			if(parseInt(nextArray[1]) <= (this.leftnum+2) % last){
				if(this.leftnum != 0){
					var right = this.rightnum % (last)==0 ? last :this.rightnum % (last);
					var left = this.leftnum % (last)==0 ? last :this.leftnum % (last);
					this.panelArray.changedom(left,right,type,this.isaddimg);
					if(!this.isaddimg){
						this.leftnum--;
						this.rightnum--;
					}else{
						this.rightnum--;
					}
				}
				
			}
		}
		
		
	}
	//alert(this.nowimgnum);
}

/*
	豆单
*/
ImagePanelTable.prototype.beanDot = function(){
	if($('dotinit')){
		document.body.removeChild($('dotinit')); 
	}
	var panelId = this.panelArray.parentId
	var div = document.createElement("div");
	div.id = "dotinit";
	var dotArrowDisplay = "none";
	var dotwidth = "256px";
	if(this.screen > 7){
		dotArrowDisplay = "block";
	}else{
		dotwidth = this.screen * 35 + "px";
	}
	div.style.cssText='width:1210px;height:120px;position:absolute;z-index:1000;top:675px;left:25px;';
	var inner = "<div style='width:"+dotwidth+";height:22px;overflow:hidden;margin:0 auto;'><img id='leftjian' src='' style='float:left;width:11px;height:19px;display:"+dotArrowDisplay+";'><div style='float:left;width:224px;height:22px;overflow:hidden;margin:0 auto;'><div id='dot' style='width:"+this.screen*224+"px;'>";
	for(var i=1; i<=this.screen; i++){
		inner += "<img style='width:22px; height:22px;margin:0px 0 0 10px;' id='"+panelId+"_"+i+"_dot' src=''/>";
	} 
	div.innerHTML = inner+"</div></div><img id='rightjian' src='' style='float:left;width:11px;height:19px;margin-left:10px;display:"+dotArrowDisplay+";'></div>";
	document.body.appendChild(div);
	this.dotGoTo(panelId+"_1_dot");
	$("dotinit").style.display="none";
}

/*
	豆单移动
*/
ImagePanelTable.prototype.dotGoTo = function(nextId){
	var preId = this.preId;
	if($(preId)){
		$(preId).src = "";
	}
	if($(nextId)){
		if(this.dotStatu == 2){
			//this.stopPanel(this);
			//this.panelPlayer(this.panelId);
			$(nextId).src = "";
		}else{
			$(nextId).src = "";
		}
		var alldot = Math.ceil(this.screen/7);
		var nextArray = nextId.split("_");
		if(parseInt(nextArray[1])<=7){
			$("leftjian").src = "";
			if(this.screen > 7){
				 $("rightjian").src = "";
			}else{
				 $("rightjian").src = "";
			}
		}else if(parseInt(nextArray[1]) > 7*(alldot-1) && parseInt(nextArray[1]) <= 7*alldot){
			$("rightjian").src = "";
		}else{
			$("leftjian").src = "";
			$("rightjian").src = "";
		}
	}
	this.preId = nextId;
}
/*
	豆单获得焦点
*/
ImagePanelTable.prototype.dotFocus = function(){
	this.dotStatu = 2;
	this.dotGoTo(this.preId);
	//var _this = this;
	//document.body.onkeydown = function(event){_this.keyDown(event,_this)};
}
/*
	标题滚动
*/
ImagePanelTable.prototype.scrollName = function(preObj,nextObj,width){
	clearInterval(searchObj.setInt);
	if(preObj){
		var preNamelen = preObj.scrollWidth;
		if(preNamelen > width){
			preObj.innerHTML = preObj.innerHTML.split("&nbsp;")[0];
			preObj.scrollLeft = 0;
		}
	}
	if(nextObj){
		var nextNamelen = nextObj.scrollWidth;
		if(nextNamelen > width){
			nextObj.innerHTML +="&nbsp;&nbsp;&nbsp;"+nextObj.innerHTML; 
			searchObj.setInt = setInterval(function(){
				nextObj.scrollLeft ++;
				if(nextObj.scrollLeft == (nextObj.scrollWidth - nextNamelen)){
					nextObj.scrollLeft = 0;
				}
			}, 1);
		}
	}
}

/*
	注册按键
*/
ImagePanelTable.prototype.setkeyfun=function(keydownfun){
	var _this = this;
	basewidget.setkeyfun(function(){return _this.keyDown(event,_this)});
	call_keydownfun = keydownfun;
}

/*
	panel按键分派
*/
ImagePanelTable.prototype.keyDown=function(event,_this){
	if(_this.preId){
		var preArray = _this.preId.split("_");
	}
	if(_this.dotStatu==2){
		if(_this.SetIntClock){return;}
		if(window.event.keyCode==38){  //上
			_this.dotStatu=1;
			_this.panelArray.getFocus(preArray[0]+"_"+preArray[1]);
			_this.dotGoTo(this.preId);
		}else if(window.event.keyCode==40){  //下
			
		}else if(window.event.keyCode==37){ //左
			if(parseInt(preArray[1]) != 1){
				_this.moveStart("left",preArray[0]+"_"+(parseInt(preArray[1])-1));
			}
		}else if(window.event.keyCode==39){  //右
			//this.panelfun.startScroll("keyboard");
			if(parseInt(preArray[1]) != _this.screen){
				_this.moveStart("right",preArray[0]+"_"+(parseInt(preArray[1])+1));
			}
		}else if(window.event.keyCode==27 ){  //_action判断是否是从panel跳转过来的，此全局变量在index.js里面
			//_action == "searchlist" &&  
			if(window.widget && window.widget.exit){
				window.widget.exit();
			}else{
				window.close();
			}
		}
	}else{
		return call_keydownfun(event);
	}
}