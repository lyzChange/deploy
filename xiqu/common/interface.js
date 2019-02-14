var isEncrypt = false;
var deviceId = '';

/**
 *获取EPG节目列表
 pageNumber 页码
 pageSize   每页的个数
 */
function cntv_EPG_MovieList(id, pageNumber, pageSize, callback) {
	var ajax = new EPG_Ajax();
	if(!pageNumber || pageNumber.length == 0) {
		pageNumber = 0;
	}
	if(!pageSize || pageSize.length == 0) {
		pageSize = 100;
	}
	ajax.setUrl(epg_ip + '/program!getMovieList.action?catgId=' + id + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize + '&random=' + Math.random());
	//ajax.setSyn(false);
	ajax.setCallback(callback);
	ajax.setAction('movielist');
	ajax.init();
	ajax.send();
	ajax.onReadyStateChange();
	ajax.callbackState();
}

/**
 *Ajax操作
 */
function EPG_Ajax() {
	this._httpReq = false;
	/*ajax初始化对象*/
	this.method = "GET";
	/*get|post*/
	this.syn = true;
	/*是否采用异步请求，默认true*/
	this.url = "";
	/*提交异步请求的url地址*/
	this.resType = "text/xml";
	/*异步请求返回数据类型text|xml*/
	this.callback = ""/*异步请求完成后的回滚函数*/
	this.readystate = -1;
	/*ajax的请求状态*/
	this.state = -1;
	/*http请求响应代码*/
	this.param = "";
	/*回调函数参数*/
	this.action = "";
	/*调用方法*/
	this.cache = "";
	/*缓存路径*/
	this.owner = "";
	/*缓存路径*/

	//设置提交异步请求的url地址
	this.setUrl = function(url) {
		this.url = url;
	}
	//设置提交类型
	this.setType = function(type) {
		this.method = type || 'get';
	}
	//设置回滚函数
	this.setCallback = function(func) {
		this.callback = func;
	}
	//设置调用方法
	this.setAction = function(action) {
		this.action = action;
	}
	//设置是否异步
	this.setSyn = function(syn) {
		this.syn = syn;
	}

	this.setOwner = function(owner) {
		this.owner = owner;
	}
	//调用window.status的方法
	this.status = function(msg) {
		window.status = msg;
	}
	//初始化ajax对象
	this.init = function() {
		if(window.XMLHttpRequest) {
			this._httpReq = new XMLHttpRequest();
			if(this._httpReq.overrideMimeType) {
				this._httpReq.overrideMimeType(this.resType);
			}
		} else if(window.ActiveXObject) {
			try {
				this._httpReq = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {
					this._httpReq = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
				}
			}
		}
	}
	//发送一个http请求
	this.send = function() {
		if(this.resType.toLowerCase() == "post") {
			this._httpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		//document.write(this.url);
		this._httpReq.open(this.method, this.url, this.syn);
		if(deviceId != undefined && deviceId !='') {
			this._httpReq.setRequestHeader("Deviceid", deviceId);
		}
		this._httpReq.send(this.content);
	}

	this.callbackState = function() {
		switch(this._httpReq.readyState) {
			case 4:
				this.readystate = 4;
				switch(this._httpReq.status) {
					case 200:
						if(this.owner) {
							eval('this.owner.' + this.callback + '(this.getParamByMethod())');
						} else {
							this.callback(this.getParamByMethod());
						}
						break;
					default:
						this.status("返回数据失败," + this._httpReq.status);
						break;
				}
				break;
			default:
				this.readystate = 0;
				break;
		}
	}
	//根据调用方法生成回调函数的参数
	this.getParamByMethod = function() {
		this.param = this._httpReq.responseText;
		return this.param;
	}

	this.onReadyStateChange = function() {
		var owner = this;
		this._httpReq.onreadystatechange = function() {
			owner.callbackState.call(owner);
		}
	}
}

/*
 * GetQueryString	获取url后的参数，加载相应的数据
 *------------------------------------------------------
 */
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return null;
}

function getTemplateData(arg,callback) {
	if(debug){
		var data = [
			{
				"minHeight":"200",
				"minWidth":"160",
				"ifpartID":"false",
				"arrow":["template_1/images/normal_left.png","template_1/images/focus_left.png","http://images.center.bcs.ottcn.com:8080/images/ysten/images/2016/12/21/20161221163336_164.png","http://images.center.bcs.ottcn.com:8080/images/ysten/images/2016/12/21/20161221163341_294.png"],
				"splitSize":"10",
				"bgImg":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/2017/9/14/20170914113203_202.png","focus":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/2017/5/17/20170517161624_392.png",
				"partData":[
					{
						"id":3385099,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/poster/images/ysten/images/icntv2/images/2017/08/22/20170821151155396.jpg","image":"http://images.center.bcs.ottcn.com:8080/poster/images/ysten/images/icntv2/images/2017/08/22/20170821151155396.jpg","partData":[],"programNumberShow":"false","sortNum":1
					},
					{
						"id":2966046,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/icntv2/images/2016/04/01/9ed1371d12f641cf91f5278de7d94ef4.jpg","image":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/icntv2/images/2016/04/01/9ed1371d12f641cf91f5278de7d94ef4.jpg","partData":[],"programNumberShow":"false","sortNum":2
					},
					{
						"id":795054,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/2013/10/xstlml20131010.jpg","image":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/2013/10/xstlml20131010.jpg","partData":[],"programNumberShow":"false","sortNum":3
					},
					{
						"id":3114445,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/icntv2/images/2016/10/24/2be0fe68e3a04a20bbd5e5b642676aa8.jpg","image":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/icntv2/images/2016/10/24/2be0fe68e3a04a20bbd5e5b642676aa8.jpg","partData":[],"programNumberShow":"false","sortNum":4
					},
					{
						"id":2819244,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/icntv2/images/2015/11/19/4c50b55dd5764c05b4f419a8bbc7e744.jpg","image":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/icntv2/images/2015/11/19/4c50b55dd5764c05b4f419a8bbc7e744.jpg","partData":[],"programNumberShow":"false","sortNum":5
					},
					{
						"id":3119743,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/poster/2016-11-29/e146e3efb5fa4f0480b9344c2dafe66c.jpg","image":"http://images.center.bcs.ottcn.com:8080/poster/2016-11-29/e146e3efb5fa4f0480b9344c2dafe66c.jpg","partData":[],"programNumberShow":"false","sortNum":6
					},
					{
						"id":3332526,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/poster/images/ysten/images/icntv2/images/2017/06/19/20170618203904.jpg","image":"http://images.center.bcs.ottcn.com:8080/poster/images/ysten/images/icntv2/images/2017/06/19/20170618203904.jpg","partData":[],"programNumberShow":"false","sortNum":7
					},
					{
						"id":3345089,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/poster/2017-09-14/69a86930215b4ac8b0db46bbb94ce553.jpg","image":"http://images.center.bcs.ottcn.com:8080/poster/2017-09-14/69a86930215b4ac8b0db46bbb94ce553.jpg","partData":[],"programNumberShow":"false","sortNum":8
					},
					{
						"id":2849690,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/poster/2015-12-18/95c197d8c0774d8ab30a2ce12ce95ea2.jpg","image":"http://images.center.bcs.ottcn.com:8080/poster/2015-12-18/95c197d8c0774d8ab30a2ce12ce95ea2.jpg","partData":[],"programNumberShow":"false","sortNum":9
					},
					{
						"id":3265350,"title":"","maskLayerShow":"false","scoreShow":"false","cornerShow":"false","action":"GetMoiveDetail","poster":"http://images.center.bcs.ottcn.com:8080/poster/2017-05-11/9f41ec7bcc3347fba3415dd45c5168ba.png","image":"http://images.center.bcs.ottcn.com:8080/poster/2017-05-11/9f41ec7bcc3347fba3415dd45c5168ba.png","partData":[],"programNumberShow":"false","sortNum":10
					},
					{
						"action": "OpenApk", //动作类型 
						"pkgName": "com.gdds.iptv_js_cmcc", //包名 
						"clsName": "", //类名
						"params":{"type":"22","columnId":"5","themePicId":"8118","columnName":"http://image.gitv.tv/images/20181130/15/15af3bafd5cce4bdb8f3b66b8249d61c.jpg"}, //请求参数
						"appid": "553", //APP的ID
						"appName": "拉贝少儿", //APP名称
						"appVersion":"1", // APP版本
						"uri": "http://112.25.77.168:8077/ysten-ams/getAppById.jsp", //APK打开地址
						"downloadUrl": "http://gamedownload.public.bcs.ottcn.com/app/553/32/1513563363464app-kid-release-3.2.apk",//APK下载地址
						"scoreShow": "false", 
						"cornerShow": "false",
						"sortNum": 1,
						"id": 1200088279,
						"title": "",
						"maskLayerShow": "false",
						"image": "http://images.center.bcs.ottcn.com:8080/poster/2018-12-25/83832806caf64d0fbce987d58be9fbd3.jpg",
						"poster": "http://images.center.bcs.ottcn.com:8080/poster/2018-12-25/83832806caf64d0fbce987d58be9fbd3.jpg",
						"partData": [],
						"programNumberShow": "false"
					}
				]
			}
		];
		// var data = [
		// 	{
		// 		"minHeight":"200",
		// 		"corner":"",
		// 		"minWidth":"160",
		// 		"ifpartID":"false",
		// 		"arrow":["template_1/images/normal_left.png","template_1/images/focus_left.png","http://images.center.bcs.ottcn.com:8080/images/ysten/images/2016/12/21/20161221163336_164.png","http://images.center.bcs.ottcn.com:8080/images/ysten/images/2016/12/21/20161221163341_294.png"],
		// 		"maskLayer":"",
		// 		"splitSize":"10","bgImg":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/2018/12/25/20181225103649_752.png","focus":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/2018/12/25/20181225103628_970.png","partData":[
		// 			{
		// 				"pkgName":"com.gdds.iptv_js_cmcc",
		// 				"params":{"type":"22","columnId":"5","themePicId":"8118","columnName":"http://image.gitv.tv/images/20181130/15/15af3bafd5cce4bdb8f3b66b8249d61c.jpg"}, //请求参数
		// 				"scoreShow":"false","cornerShow":"false","appid":"553","image":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/icntv2/images/2018/09/04/4aabd1613bd9468cb93b23784760c7aa.jpg","downloadUrl":"http://gamedownload.public.bcs.ottcn.com/app/553/32/1513563363464app-kid-release-3.2.apk","appForceUpdate":"",
		// 				"clsName":"",
		// 				"uri":"http://112.25.77.168:8077/ysten-ams/getAppById.jsp",
		// 				"sortNum":1,
		// 				"appName":"拉贝少儿",
		// 				"title":"梦巴萨",
		// 				"maskLayerShow":"false",
		// 				"appVersion":"1","poster":"http://images.center.bcs.ottcn.com:8080/images/ysten/images/icntv2/images/2018/09/04/4aabd1613bd9468cb93b23784760c7aa.jpg",
		// 				"action":"OpenApk",
		// 				"appAction":"",
		// 				"partData":[],
		// 				"programNumberShow":"false"
		// 			}
		// 		]
		// 	}
		// ];
		// data = 1;
		callback(JSON.stringify(data));
		return true;
	}

	var ajax = new EPG_Ajax();
	ajax.setSyn(true);
	ajax.setUrl(data_ip + '/getTopicData?topicName=' + arg + '&random=' + Math.random());
	ajax.setCallback(callback);
	ajax.init();
	ajax.send();
	ajax.onReadyStateChange();
	ajax.callbackState();
	return true;
}

function getTemplateData_sns(arg,callback) {
	var ajax = new EPG_Ajax();
	ajax.setSyn(true);
//	console.log(sns_url + '/box_api/cntv-api/interface.php?action=album&ip=' +data_ip + '/getTopicData?topicName='+ arg);
	ajax.setUrl(sns_url + '/box_api/cntv-api/interface.php?action=album&ip=' + data_ip + '/getTopicData?topicName=' + arg + '&random=' + Math.random());
	ajax.setCallback(callback);
	ajax.init();
	ajax.send();
	ajax.onReadyStateChange();
	ajax.callbackState();
	return true;
}

function $(id){
    return document.getElementById(id);
}
//图片加载
function ShowHide(id,pos){
    $(id+pos+"img").style.display = "none";
}

/* Ajax操作 */
function Log_Ajax() {
	this._httpReq = false;
	this.syn = true;
	this.url = '';
	this.callback = '';
	this.readystate = -1;
	this.state = -1;
	this.param = '';
	this.action = '';
	this.owner = '';
	this.data = '';

	this.setUrl = function (url) {
		this.url = url;
	}
	this.setCallback = function (func) {
		this.callback = func;
	}
	this.setAction = function (action) {
		this.action = action;
	}
	this.setData = function (data) {
		this.data = data;
	}
	this.setSyn = function (syn) {
		this.syn = syn;
	}
	this.setOwner = function (owner) {
		this.owner = owner;
	}
	this.status = function (msg) {
		window.status = msg;
	}
	this.init = function () {
		if (window.XMLHttpRequest) {
			this._httpReq = new XMLHttpRequest();
			if (this._httpReq.overrideMimeType) {
				this._httpReq.overrideMimeType(this.resType);
			}
		} else if (window.ActiveXObject) {
			try {
				this._httpReq = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					this._httpReq = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
				}
			}
		}
	}
	this.send = function (type) {
		this._httpReq.open(type, this.url, this.syn);
		if (type == "post") {
			this._httpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			this._httpReq.send(this.data);
		} else {
			this._httpReq.send();
		}
	}
	this.callbackState = function () {
		switch (this._httpReq.readyState) {
			case 4:
				this.readystate = 4;
				switch (this._httpReq.status) {
					case 200:
						if (this.owner) {
							if (typeof this.owner == 'object') {
								//this.callback.call(this.owner,this.getParamByMethod());
								eval('this.owner.' + this.callback + '(this.getParamByMethod())');
							} else {
								this.callback(this.getParamByMethod(), this.owner);
							}
						} else {
							this.callback(this.getParamByMethod());
						}
						break;
					default:
						this.status("返回数据失败," + this._httpReq.status);
						break;
				}
				break;
			default:
				this.readystate = 0;
				break;
		}
	}
	//根据调用方法生成回调函数的参数
	this.getParamByMethod = function () {
		this.param = this._httpReq.responseText;
		return this.param;
	}
	this.onReadyStateChange = function () {
		var owner = this;
		this._httpReq.onreadystatechange = function () {
			owner.callbackState.call(owner);
		}
	}
	this.get = function (action, url, callback, owner) {
		this.init();
		this.setUrl(url);
		this.setAction(action);
		this.setCallback(callback);
		if (owner) {
			this.setOwner(owner);
		}
		this.send('get');
		this.onReadyStateChange();
		this.callbackState();
	}
	this.post = function (action, url, data, callback, owner) {
		this.init();
		this.setUrl(url);
		this.setAction(action);
		this.setData(data);
		this.setCallback(callback);
		if (owner) {
			this.setOwner(owner);
		}
		this.send('post');
		this.onReadyStateChange();
		this.callbackState();
	}
}
/* logger封装 */
var logger = (function () {
	var loghost = 'http://127.0.0.1:8087/logup/';
	var logger = function () {
	};
	var ajax = new Log_Ajax();
	var modules = new Array();
	var luserId;//上海视频基地追加字段
	var lterminalId;//上海视频基地追加字段
	var ltoken;//上海视频基地追加字段
	var lcsUsername;//上海视频基地追加字段
	if (window.widgetmanager && window.widgetmanager.getParameter) {
		luserId = window.widgetmanager.getParameter('userId');
		console.log('luserId' + luserId);
		lterminalId = window.widgetmanager.getParameter('terminalId');
		console.log('lterminalId' + lterminalId);
		ltoken = window.widgetmanager.getParameter('token');
		console.log('ltoken' + ltoken);
		lcsUsername = window.widgetmanager.getParameter('cs-username');
		console.log('lcsUsername' + lcsUsername);
	} else {
		console.log('no method window.widgetmanager.getParameter');
	}
	modules['worldCup'] = 400;

	logger.debug = function (module, content) {
		if (lterminalId) {
			content += ',userId=' + luserId + ',terminalId=' + lterminalId + ',token=' + ltoken + ',cs-username=' + lcsUsername;
		}
		var url = loghost + '0/' + modules[module];
		if (module == 'Player') {
			url += '/PlayLog';
		} else if (lterminalId) {
			url += '/VideoLog';
		} else {
			url += '/AppLog';
		}
		console.log('logger.debug send ' + url + '/' + content);
		try {
			ajax.post('log', url, content, function (ret) {
				console.log('logger.debug:' + content + '>>' + ret);
			});
		} catch (e) {
			console.log('logger.debug error');
		}
	}
	logger.info = function (module, content) {
		console.log(content);
		if (lterminalId && modules[module] != 400) {
			content += ',userId=' + luserId + ',terminalId=' + lterminalId + ',token=' + ltoken + ',cs-username=' + lcsUsername;
		}
		var url = loghost + '1/' + modules[module];
		if (module == 'Player') {
			url += '/PlayLog';
		} else if (lterminalId && modules[module] != 400) {
			url += '/VideoLog';
		} else if (module == 'worldCup') {
			url += '/log';
		} else {
			url += '/AppLog';
		}
		console.log('logger.info send ' + url + '/' + content);
		try {
			ajax.post('log', url, content, function (ret) {
				console.log('logger.info:' + content + '>>' + ret);
			});
		} catch (e) {
			console.log('logger.info error');
		}
	}
	logger.warning = function (module, content) {
		if (lterminalId) {
			content += ',userId=' + luserId + ',terminalId=' + lterminalId + ',token=' + ltoken + ',cs-username=' + lcsUsername;
		}
		var url = loghost + '2/' + modules[module];
		if (module == 'Player') {
			url += '/PlayLog';
		} else if (lterminalId) {
			url += '/VideoLog';
		} else {
			url += '/AppLog';
		}
		console.log('logger.warning send ' + url + '/' + content);
		try {
			ajax.post('log', url, content, function (ret) {
				console.log('logger.warning:' + content + '>>' + ret);
			});
		} catch (e) {
			console.log('logger.warning error');
		}
	}
	logger.error = function (module, content) {
		if (lterminalId) {
			content += ',userId=' + luserId + ',terminalId=' + lterminalId + ',token=' + ltoken + ',cs-username=' + lcsUsername;
		}
		var url = loghost + '3/' + modules[module];
		if (module == 'Player') {
			url += '/PlayLog';
		} else if (lterminalId) {
			url += '/VideoLog';
		} else {
			url += '/AppLog';
		}
		console.log('logger.error send ' + url + '/' + content);
		try {
			ajax.post('log', url, content, function (ret) {
				console.log('logger.error:' + content + '>>' + ret);
			});
		} catch (e) {
			console.log('logger.error error');
		}
	}
	logger.critical = function (module, content) {
		if (lterminalId) {
			content += ',userId=' + luserId + ',terminalId=' + lterminalId + ',token=' + ltoken + ',cs-username=' + lcsUsername;
		}
		var url = loghost + '4/' + modules[module];
		if (module == 'Player') {
			url += '/PlayLog';
		} else if (lterminalId) {
			url += '/VideoLog';
		} else {
			url += '/AppLog';
		}
		console.log('logger.critical send ' + url + '/' + content);
		try {
			ajax.post('log', url, content, function (ret) {
				console.log('logger.critical:' + content + '>>' + ret);
			});
		} catch (e) {
			console.log('logger.critical error');
		}
	}
	//上传json串数据，上报付费频道时调用
	logger.infoJSON = function (module, dataJSON) {
		//
		var url = loghost + '1/' + modules[module];
		url += '/log/';
		if (dataJSON && typeof dataJSON == 'object') {
			try {
				url += JSON.stringify(dataJSON);
				console.log('logger.infoJSON->url=' + url);
				ajax.post('log', url, null, function (ret) {
					console.log('logger.infoJSON->result:' + ret);
				});
			} catch (e) {
				console.log('logger.infoJSON->error:' + e);
			}
		} else {
			console.log('logger.infoJSON->data error:' + dataJSON);
		}
	}
	/*logger上报地址处理,对/做转义，并进行encode编码*/
	logger.getUrl = function (url) {
		var _url;
		if (url) {
			_url = url.replace(/\//g, '\\\/');
		} else {
			_url = (location.href).replace(/\//g, '\\\/');
		}
		_url = encodeURIComponent(_url);
		console.log('url->' + _url);
		return _url;
	}
	return logger;
})();

//获取地址栏参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return decodeURIComponent(r[2]);
	}
	return null;
}

var formatDateAll = function (date, format, isTimeShift) {
	if (arguments.length < 2 && !date.getTime) {
		format = date;
		date = new Date();
	}
	(typeof format != 'string') && (format = 'YYYY年MM月DD日 hh时mm分ss秒');
	var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六'];
	var tmp;
	return format.replace(/YYYY|YY|MM|DD|hh|mm|ss|星期|周|www|week/g, function (a) {
		switch (a) {
			case "YYYY":
				return date.getFullYear();
			case "YY":
				return (date.getFullYear() + "").slice(2);
			case "MM":
				tmp = (date.getMonth() + 1) + '';
				if (isTimeShift) {
					return tmp.length == 1 ? '0' + tmp : tmp;
				}
				return tmp.length == 1 && false ? '0' + tmp : tmp;
			case "DD":
				tmp = date.getDate() + '';
				if (isTimeShift) {
					return tmp.length == 1 ? '0' + tmp : tmp;
				}
				return tmp.length == 1 && false ? '0' + tmp : tmp;
			case "hh":
				tmp = date.getHours() + '';
				return tmp.length == 1 ? '0' + tmp : tmp;
			case "mm":
				tmp = date.getMinutes() + '';
				return tmp.length == 1 ? '0' + tmp : tmp;
			case "ss":
				tmp = date.getSeconds() + '';
				return tmp.length == 1 ? '0' + tmp : tmp;
			case "星期":
				return "星期" + week[date.getDay() + 7];
			case "周":
				return "周" + week[date.getDay() + 7];
			case "week":
				return week[date.getDay()];
			case "www":
				return week[date.getDay()].slice(0, 3);
		}
	});
};

//页面曝光上报
//epg页面曝光上报
function EPG_expose(from){
	//
	var _content = {};
	_content.uid = (getQueryString("userID")||'') + '';
	_content.utype = '0';
	_content.t = new Date().getTime();
	_content.event_id = 'expose';
	var _props = {};
	_props.activity_id = getQueryString('activity_id')||"";
	_props.from = from ||'0';
	_props.widget_id = '15';
	_props.topicid = (getQueryString('topicid')||getQueryString('topicName')||'') + '';
	_props.url = logger.getUrl();
	_props.startTime = formatDateAll(new Date(),'YYYY-MM-DD hh:mm:ss',true);
	_content.props = _props;

	_content = JSON.stringify(_content);

	logger.info('worldCup' ,_content);
	_content = _props = null;
}
//播放器点击上报
function player_click(cid,pid, id ,channelid) {
	var _content = {};
	_content.uid = (getQueryString("userID")||'') + '';
	_content.utype = '0';
	_content.t = new Date().getTime();
	_content.event_id = 'click';
	var _props = {};
	_props.widget_id = '15.4';

	if (id) {
		_props.widget_id = _props.widget_id + '.' + id;
	}
	_props.cid = cid || '';
	_props.channelid = channelid || '';
	_props.pid = pid || '';
	_props.topicid = (getQueryString('topicid')||getQueryString('topicName')||'') + '';
	_props.activity_id = getQueryString('activity_id')||'';
	_props.url = logger.getUrl();
	_content.props = _props;
	_content = JSON.stringify(_content);

	logger.info('worldCup', _content);
	_content = _props = null;
}
//功能块点击
function fun_click(action_url ,cid , id){
	var _content = {};
	_content.uid = (getQueryString("userID")||'') + '';
	_content.utype = '0';
	_content.t = new Date().getTime();
	_content.event_id = 'click';
	var _props = {};
	_props.widget_id = '15.6';

	if (id) {
		_props.widget_id = _props.widget_id + '.' + id;
	}
	_props.cid = cid || '';
	_props.topicid = (getQueryString('topicid')||getQueryString('topicName')||'') + '';
	_props.activity_id = getQueryString('activity_id')||'';
	_props.url = logger.getUrl();
	if (action_url){
		_props.action_url = logger.getUrl(action_url);
	}else{
		_props.action_url = '';
	}
	_content.props = _props;
	_content = JSON.stringify(_content);

	logger.info('worldCup', _content);
	_content = _props = null;
}