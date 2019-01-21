// JavaScript Document
//
var point_setint =""; //网络连接定时器
var loading_timeout = 15000 //15秒
var EPG_ajax_url = "http://localhost/home/";//"http://ccbn.ysten.com";
var KEY_LEFT = 37;      //
var KEY_UP = 38;        //
var KEY_RIGHT = 39;     //
var KEY_DOWN = 40;      //
var KEY_ENTER = 13;     //
var KEY_BACK = 27;      //BACKSPACE
var KEY_MENU = 36      //Home
var KEY_SCROLLUP = 33;	//(PAGEUP)
var KEY_SCROLLDOWM = 34;	//(PAGEDOWN)
var KEY_0 = 48;
var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;
var KEY_6 = 54;
var KEY_7 = 55;
var KEY_8 = 56;
var KEY_9 = 57;
var KEY_BACKSPACE = 8;
var KEY_Clear=12;
var KEY_SELECT = 41;
var KEY_VOL_MUTE = 117;  //(F6)
var KEY_VOL_ADD = 118;   //F7)
var KEY_VOL_SUB = 119;   //(F8)
var KEY_OPTION = 121;    //(F10)
var KEY_HOME = 36;      //(Home)
var g_callback_keyfun;
var g_callback_popwindow_keyfun;
var g_actiontype;
var isHualu = false;//判断是否是华录终端(华录终端请忽略这个配置，会自动获取)
if(window.projectName && window.projectName.indexOf('HUALU') != -1){
	isHualu = true;
}
function BaseWidget()
{
	this.menulist_stack = new Array();
	this.HandleKeyDownEvent = undefined;
	this.popwindow_show = false;
	this.popwindow_container =null;
	this.loading_show = false;
	this.pre_destructor_callbackfun =null;
	this.ispopaction = false;
	this.actioning_timeout = 0;
	this.owner;
}
var ACTION_Packeg=1;//产品包列表
var ACTION_Pay=2; //支付页面
BaseWidget.prototype.setkeyfun = function(reg_callback_keyfun,owner) //注册按键处理
{
	g_callback_keyfun = reg_callback_keyfun;
	this.owner = owner;
}

BaseWidget.prototype.do_action = function(destructor_callbackfun,actiontype,actonid,actionarg,channelsort)
{
	//alert("actiontype:"+actiontype+" "+destructor_callbackfun);
	var _ispopaction = this.ispopaction;
	if(this.pre_destructor_callbackfun)
	{
		this.pre_destructor_callbackfun.call(this.owner);
	}
	
	if(this.ispopaction != true)
	{
		this.pushpage(destructor_callbackfun,actiontype,actonid,actionarg);
	}else
	{
		this.ispopaction = false;
	}
	this.pre_destructor_callbackfun = destructor_callbackfun;
	switch(actiontype)
	{
		case ACTION_Packeg:
			packageInit.init(actonid,_ispopaction,"list");
			break;
        case ACTION_Pay:
			payTypeChoice.init(actonid,_ispopaction,"searchPlay");
            break;
		default:
			break;		
	}
	//g_actiontype=actiontype;
}
//POP window type

var POPUP_WIN_TYPE_Copying = 0;    
var POPUP_WIN_TYPE_Moving = 1;    
var POPUP_WIN_TYPE_Confirm = 2;  
var POPUP_WIN_TYPE_Deleting = 3; 
var POPUP_WIN_TYPE_ErrTip = 4;    
var POPUP_WIN_TYPE_Login = 5;   
var POPUP_WIN_TYPE_Waiting = 6;   
var POPUP_WIN_TYPE_InfoTip = 7;

var MsgProgressBar = 100;//"<img src='images/loading_fs.gif' width='436'>";
var popLoadingbar = "<div style='background-image:url(images/poploadingbg.png); position:absolute; width:436px;height:30px; overflow:hidden;'><img id='poploading' style='position:absolute;top:0px;' src='images/poploading.png'/></div>";


BaseWidget.prototype.Self_HandleKeyDownEvent = function(event)
{
/*	if(PLUGIN.getUserID){
		alert("<===============KeyDownEvent==============>"+event.keyCode);
	}else{
		console.log("<===============KeyDownEvent==============>"+event.keyCode);
	}*/
	var keyCode = event.keyCode;
	if(this.popwindow_show ==false)
	{
		if(true == g_callback_keyfun.call(this.owner,event))
		{
			return;
		}
	}else
	{
		/*if(true == g_callback_popwindow_keyfun(event))
		{
			return;
		}*/
		g_callback_popwindow_keyfun(event);
		return;
	}
	var keyCode = event.keyCode;
//	console.log("basewidget keyCode->"+keyCode);
	switch(keyCode)
	{
		case KEY_UP:  //up
			if(this.focusIndex > 0)
			{
				this.focusIndex--;
				this.dpFocus.style.top = 36 * this.focusIndex;
			}
			break;
		case KEY_DOWN:  //down 
			if(this.focusIndex < this.optionNumber)
			{
				this.focusIndex++;
				this.dpFocus.style.top = 36 * this.focusIndex;
			}
			break;
		case KEY_ENTER:  //enter
				break;
		case KEY_BACK:  //enter
			
			this.poppage();
			break;
		case KEY_VOL_MUTE:  //f6  
			$("yst-base-plugin").setVideoOutputMode(1); 
			$("yst-base-plugin").systemReboot();  
			break;
		case KEY_VOL_ADD:  //f7  
			$("yst-base-plugin").setVideoOutputMode(2); 
			$("yst-base-plugin").systemReboot();  
			break;
		default:
			break;
	}
}
//页面跳转loading显示
BaseWidget.prototype.skipLoadingShow = function (){
	//this.loading_show = true;
	//SOH("loading","block");
	//window.setTimeout.("basewidget.skipLoadingHid",loading_timeout)；
}
//页面跳转loading隐藏
BaseWidget.prototype.skipLoadingHid = function (){
	//alert("skipLoadingHid");
	//this.loading_show = false;
	//SOH("loading","none");
}
BaseWidget.prototype.PopupWindowReg = function(id,callback_popwindw_keyfun) //注册pop窗口 id表示pop窗口的div的id callback_popwindw_keyfun是窗口的处理函数
{
  	g_callback_popwindow_keyfun = callback_popwindw_keyfun;
  	this.popwindow_container = $(id);
}

BaseWidget.prototype.show = function()    //显示pop窗口
{
	//$("mengbanceng_id").style.display = "block";
	this.popwindow_container.style.display = "block";
	this.popwindow_show =true;
}
BaseWidget.prototype.hide = function()    //隐藏pop窗口
{
	//$("mengbanceng_id").style.display = "none";
	if(this.popwindow_container){
		this.popwindow_container.style.display = "none";
	}
	this.popwindow_show =false;	
}

BaseWidget.prototype.pushpage = function(destructor_callbackfun,actiontype,actonid,actionarg)
{
	var pageurlobj =new Object();
	pageurlobj.destructor_callbackfun = destructor_callbackfun;
	pageurlobj.actiontype = actiontype;
	pageurlobj.actonid = actonid;
	pageurlobj.actionarg = actionarg;
	this.menulist_stack.push(pageurlobj);
}
BaseWidget.prototype.clearpage = function()
{
	this.menulist_stack.splice(0,this.menulist_stack.length-1);
	//this.pre_destructor_callbackfun = homePageListClear;
	this.ispopaction = false;
}
BaseWidget.prototype.removetoppage = function()
{
	if(this.menulist_stack.length <=1)
	{
		return;
	} 
	this.menulist_stack.pop();
}
BaseWidget.prototype.poppage = function()
{
    if(this.menulist_stack.length <=1){
		console.log("poppage  window   exit");
		try{
			for (var i in __ajaxObj__){
				console.log('ajax try abort');
				__ajaxObj__[i].abort();
			}
		}catch (e){
			console.log('ajax try abort->error:'+e);
		}
        if(window.widget)
            window.widget.exit();
        else
            window.close();
        return;
    }
    var pageurlobj = this.menulist_stack.pop();
	var proobj =this.menulist_stack[this.menulist_stack.length-1];
	/*if(proobj.actiontype == ACTION_GetMenuMovieDetail)
	{
		pageurlobj = this.menulist_stack.pop();
		proobj =this.menulist_stack[this.menulist_stack.length-1];
	}*/
	
	this.ispopaction =true; 
	this.do_action(proobj.destructor_callbackfun,proobj.actiontype,proobj.actonid,proobj.actionarg);
}

BaseWidget.prototype.popnpage = function(n)
{
	if(this.menulist_stack.length <=1)
	{
		return;
	}
	var i;
	for(i=n ; i>1 ; i--)
	{
		this.menulist_stack.pop();
	}
	var pageurlobj = this.menulist_stack.pop();
	var proobj =this.menulist_stack[this.menulist_stack.length-1];
	/*if(proobj.actiontype == ACTION_GetMenuMovieDetail)
	{
		pageurlobj = this.menulist_stack.pop();
		proobj =this.menulist_stack[this.menulist_stack.length-1];
	}*/
	
	this.ispopaction =true; 
	this.do_action(proobj.destructor_callbackfun,proobj.actiontype,proobj.actonid,proobj.actionarg);
}

BaseWidget.prototype.poppage_review = function()
{
	if(this.menulist_stack.length <=1)
	{
		return;
	} 
	var pageurlobj = this.menulist_stack.pop();
	var proobj =this.menulist_stack[this.menulist_stack.length-1];
	this.ispopaction =true; 
	this.do_action(proobj.destructor_callbackfun,proobj.actiontype,proobj.actonid,proobj.actionarg);
}
var SELECT_OPTION_TYPE_DPI = 0;            //
var SELECT_OPTION_TYPE_DownPath = 1;       //
var SELECT_OPTION_TYPE_UserBandWidth = 2;  //
var SELECT_OPTION_TYPE_DownRate = 3;       //
var SELECT_OPTION_TYPE_DownNum = 4;        //
var SELECT_OPTION_TYPE_SoundCode = 5;      //Դ
var SELECT_OPTION_TYPE_Decode = 6;         //
var SELECT_OPTION_TYPE_OutputStandart = 7; //

//
function SelectOption()
{
	this._parent = null; //
	this._slef = null;
	
	this.type;
	this.focusIndex = 0;
	this.optionNumber = 0;
	this.dpFocus = null;
	
	this.Create = function(id, parent, type)
	{
		//alert("SelectOption.Create() start!");
		this._parent = parent;
		this._self = new BaseWidget(WIDGET_TYPE_SelectOption, id);
		this.type = type;

		switch(this.type)
		{
			case SELECT_OPTION_TYPE_DPI:
				this._self.container.innerHTML = "<div id='dpFocus'><img src='images/focus_select.png'></div>"
					+ "<div id='dpItem0' class='dpItem'>480I</div>"
					+ "<div id='dpItem1' class='dpItem'>480P</div>"
					+ "<div id='dpItem2' class='dpItem'>576I</div>"
					+ "<div id='dpItem3' class='dpItem'>576P</div>"
					+ "<div id='dpItem4' class='dpItem'>720P60</div>"
					+ "<div id='dpItem5' class='dpItem'>720P50</div>"
					+ "<div id='dpItem6' class='dpItem'>720P30</div>"
					+ "<div id='dpItem7' class='dpItem'>720P25</div>"
					+ "<div id='dpItem8' class='dpItem'>1080I60</div>"
					+ "<div id='dpItem9' class='dpItem'>1080I50</div>"
					+ "<div id='dpItem10' class='dpItem'>1080P30</div>"
					+ "<div id='dpItem11' class='dpItem'>1080P25</div>"
					+ "<div id='dpItem12' class='dpItem'>1080P60</div>"
					+ "<div id='dpItem13' class='dpItem'>1080P50</div>";
				this.optionNumber = 13;
				this._self.container.style.top = "194px";
				this._self.container.style.left = "616px";
				break;
			case SELECT_OPTION_TYPE_OutputStandart:
				this._self.container.innerHTML = "<div id='dpFocus'><img src='images/focus_select.png'></div>"
					+ "<div id='dpItem0' class='dpItem'>NTSC</div>"
					+ "<div id='dpItem1' class='dpItem'>PAL</div>";
				this.optionNumber = 1;
				this._self.container.style.top = "256px";//194 + 62;
				this._self.container.style.left = "616px";
				break;
			case SELECT_OPTION_TYPE_DownPath:
				if(settingWin.diskNameList==null)
					settingWin.diskNameList = gefo.fs.getDiskList().split(",");
				var innerStr = "<div id='dpFocus'><img src='images/focus_select.png'></div>";
				for(var i=0; i<settingWin.diskNameList.length; i++)
				{
					var devName = settingWin.diskNameList[i].split(":")[0].replace(/HDD/i, "Ӳ�̷���");
					innerStr = innerStr + "<div id='dpItem"+i+"' class='dpItem'>"+devName+"</div>"
				}
				this.optionNumber = settingWin.diskNameList.length-1;
				this._self.container.innerHTML = innerStr;
				this._self.container.style.top = "194px";
				this._self.container.style.left = "640px";
				break;
			case SELECT_OPTION_TYPE_DownNum:
				this._self.container.innerHTML = "<div id='dpFocus'><img src='images/focus_select.png'></div>"
					+ "<div id='dpItem0' class='dpItem'>5</div>"
					+ "<div id='dpItem1' class='dpItem'>4</div>"
					+ "<div id='dpItem2' class='dpItem'>3</div>"
					+ "<div id='dpItem3' class='dpItem'>2</div>"
					+ "<div id='dpItem4' class='dpItem'>1</div>";
				this.optionNumber = 4;
				this._self.container.style.top = "256px";//194 + 62;
				this._self.container.style.left = "640px";
				break;
			case SELECT_OPTION_TYPE_UserBandWidth:
				this._self.container.innerHTML = "<div id='dpFocus'><img src='images/focus_select.png'></div>"
					+ "<div id='dpItem0' class='dpItem'><1M</div>"
					+ "<div id='dpItem1' class='dpItem'>1M</div>"
					+ "<div id='dpItem2' class='dpItem'>2M</div>"
					+ "<div id='dpItem3' class='dpItem'>4M</div>"
					+ "<div id='dpItem4' class='dpItem'>8M</div>"
					+ "<div id='dpItem5' class='dpItem'>>8M</div>";
				this.optionNumber = 5;
				this._self.container.style.top = "318px";//194 + 62*2;
				this._self.container.style.left = "640px";
				break;
			case SELECT_OPTION_TYPE_DownRate:
				this._self.container.innerHTML = "<div id='dpFocus'><img src='images/focus_select.png'></div>"
					+ "<div id='dpItem0' class='dpItem'>���</div>"
					+ "<div id='dpItem1' class='dpItem'>75%</div>"
					+ "<div id='dpItem2' class='dpItem'>50%</div>"
					+ "<div id='dpItem3' class='dpItem'>25%</div>"
					+ "<div id='dpItem4' class='dpItem'>10%</div>";
				this.optionNumber = 4;
				this._self.container.style.top = "380px";//194 + 62*3;
				this._self.container.style.left = "640px";
				break;
			case SELECT_OPTION_TYPE_SoundCode:
				break;
			case SELECT_OPTION_TYPE_Decode:
				this._self.container.innerHTML = "<div id='dpFocus'><img src='images/focus_select.png'></div>"
					+ "<div id='dpItem0' class='dpItem'></div>"
					+ "<div id='dpItem1' class='dpItem'></div>"
					+ "<div id='dpItem2' class='dpItem'></div>"
					+ "<div id='dpItem3' class='dpItem'></div>";
				this.optionNumber = 3;
				this._self.container.style.top = "256px";//194 + 62 + 20;
				this._self.container.style.left = "670px";
				break;
		}

		this._self.container.style.height = 36 * (this.optionNumber+1);
		this.dpFocus = document.getElementById("dpFocus");

		this._self.show();
		currentWidetType = this._self.type;
		//alert("SelectOption.Create() end!");
	}
	
	this.Back = function()
	{
		this._self.hide();
		this.focusIndex = 0;
		this.dpFocus.style.top = 0;
		this.optionNumber = 0;
		this._parent.show();
		currentWidetType = this._parent.type;
	}
}

//base lib
/*
	做隐藏显示
*/
function SOH(divId,type){
	$(divId).style.display=type;
}
/*
	封装getElementById;
*/
function $(id){
	return document.getElementById(id);
}
//获取包含中文在内的字符串长度一个中文长度为二
function getStrLength(str) {   
    var cArr = str.match(/[^\x00-\xff]/ig);   
    return str.length + (cArr == null ? 0 : cArr.length);   
}  
//无乱码字符串截取
String.prototype.sub = function(n){
var r = /[^\x00-\xff]/g;
if(this.replace(r, "mm").length <= n) return this;
	 // n = n - 3;
	var m = Math.floor(n/2);
	for(var i=m; i<this.length; i++){
		if(this.substr(0, i).replace(r, "mm").length>=n){
			return this.substr(0, i) //+"...";
		}
	}
	return this;
};

function bind(context)
{
	if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = slice.call(arguments, 1);
    return function() 
    {
		var a = merge(args, arguments);
		return __method.apply(context, a);
    }
}
  
function bindAsEventListener(context) {
    var __method = this, args = slice.call(arguments, 1);
    return function(event) {
      var a = update([event || window.event], args);
      return __method.apply(context, a);
    }
  }
//性能测试函数
//func调用的函数 times 调用的次数
function evalTime(func,times,obj,args) 
{
	times = times || 100000; //默认执行100000次
	obj = obj || null;
	args = args || [];

	var old = new Date();
	for (var i=0;i<times;i++){
		func.apply(obj,args);
	}
	var etime = (new Date()) - old;
	if(window.console && console.info){
		console.info(etime);
	}
	document.writeln(func +"<p>函数执行"+ times +"次消耗时间为："+etime+"ms</p>");
	return etime;
};

var Watch = {
  result: [],
  guid: -1,
  totalTime: 0,
  start: function(title){
    this.result[++this.guid] = [title || this.guid, new Date().getTime()];
  },
  stop: function(){
    var r = this.result[this.guid];
    var t = new Date().getTime() - r[1];
    this.totalTime += t;
    r[1] = t;
  },
  report: function(){
    this.guid = -1; //复原，重新开始计数
    var div = document.createElement("div");
    div.style.fontSize="12px";
    document.body.appendChild(div);
    var str = [];
    str.push("<p><b>The total times:</b><span style='color:#f00'>"+this.totalTime+"</span> ms.</p>");
    for (var i = 0, l = this.result.length; i < l; i++) {
      var temp=document.createElement("div");
      var span = document.createElement("span");
      var inner_span = document.createElement("span");
      temp.appendChild(span);
      span.appendChild(inner_span);
      span.style.width="200px";
      span.style.display="inline-block";
      span.style.backgroundColor="#eee";
      inner_span.style.backgroundColor = "#f00";
      inner_span.style.width = parseInt(200 * this.result[i][1] / this.totalTime) + "px";
      inner_span.style.display="inline-block";
      inner_span.innerHTML=this.result[i][1];
      str.push("<p><span style='width:150px; display:inline-block;'>" + this.result[i][0] + ":</span> "+temp.innerHTML+"</p>");
      temp=null;
      span=null;
      inner_span=null;
    }
    div.innerHTML = str.join("");
  },
  fns:function(){
    var a=arguments;
    for(var i=0,l=a.length;i<l;i++){
      this.start();
      a[i]();
      this.stop();
    }
  },
  execByTimes:function(fn,times,title){
    this.start(title);
    while(times--){
      fn();
    }
    this.stop();
  }
}

function jsonToString(obj)
{  
    var THIS = this;   
    switch(typeof(obj)){  
            case 'string':  
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';  
            case 'array':  
                return '[' + obj.map(THIS.jsonToString).join(',') + ']';  
            case 'object':  
                 if(obj instanceof Array){  
                    var strArr = [];  
                    var len = obj.length;  
                    for(var i=0; i<len; i++){  
                        strArr.push(THIS.jsonToString(obj[i]));  
                    }  
                    return '[' + strArr.join(',') + ']';  
                }else if(obj==null){  
                    return 'null';  
  
                }else{  
                    var string = [];  
                    for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));  
                    return '{' + string.join(',') + '}';  
                }  
            case 'number':  
                return obj;  
            case false:  
                return obj;  
   }  
}
/* point_setint = setInterval(function(){getActiv()}, 2000);
function getActiv(type){
	var Network = $("Network");
	var active = Network.getActiveType();
	if(active == -1){
		
		if(type=="connet"){
			$("newPointLang").innerHTML="连接异常";
		}else{
			newPointLanguage("连接异常","重新连接");
		}
		clearInterval(point_setint);
		point_setint = 0;
	}else if(point_setint == 0){
		point_setint = setInterval(function(){getActiv()}, 2000);
	}else if(active==1 && type=="connet"){
		clearInterval(point_setint);
		point_setint = setInterval(function(){getActiv()}, 2000);
		newPointHid();  
	}
	//$("aaa").innerHTML=active;
} */
/*
function $(element) {
  if (arguments.length > 1) {
    for (var i = 0, elements = [], length = arguments.length; i < length; i++)
      elements.push($(arguments[i]));
    return elements;
  }
  if (Object.isString(element))
    element = document.getElementById(element);
  return Element.extend(element);
}
*/
var mynewinterval;
var oldfilmname;
function startScroll(container,object,object2) {
	oldfilmname=$(object).innerHTML;
	$(object).innerHTML=$(object2).value;
	mynewinterval = setInterval(function(){objScroll(container,object)}, 10);
}

function stopScroll(object){
	clearInterval(mynewinterval);
	$(object).innerHTML=oldfilmname;
}

function objScroll(container, object) {
	$(container).scrollLeft+=1;
	if($(container).scrollLeft==0){
		stopScroll(object+'_l');
	}
	//if($(container).scrollLeft == ($(object).offsetWidth-120)/2+120){本地浏览器120px
	if($(container).scrollLeft == ($(object).offsetWidth-120)/2+95){
		$(container).scrollLeft = 0;
	}
}
//base lib
/*
 做隐藏显示
 */
function SOH(divId,type){
    var idArray = divId.split(",");
    for(var i = 0; i< idArray.length; i++){
        $(idArray[i]).style.display=type;
    }
}

function setStyle3(obj, name, value){
    var style = 'Webkit' + name.charAt(0).toUpperCase() + name.substring(1);
    obj.style[style] = value;
    obj = null;
}

function getid(str,index){
    return Number(str.split('_')[index]);
}

function setid(str,index,value){
    var arr = str.split('_');
    arr[index] = value;
    return arr.join('_');
}

function getLetter(id){
    var letter;
    letter = String.fromCharCode((getid(id,2)-1)*4+getid(id,3)+64);
    return letter;
}

function setStyleCss3(obj,name,value){
    obj.style[name]=value;
    obj=null;
}

