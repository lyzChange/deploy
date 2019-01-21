var abilityString;//能力串
var spToken;
var vip_ip_v2;//浙江统一支付接口
var phone;//用户主账号
var userName;
var deviceID;//设备串号
var deviceMac;//设备，mac
var snsUserId;//用户id
var accountIdentity;//盒子绑定的手机号
var VersionInfo;//版本信息
var token;

viper=GetQueryString('viper');
spversion=GetQueryString('spversion');

init();
getTokenString();
maketest();//测试


if(!phone){
	phone = '10';
	if (debug){
		phone = debugData.phone;
	}
}
if(!spToken){
    spToken='1234usertoken';
	if (debug){
		spToken = debugData.spToken;
	}
}

/*
spToken='0D0567CE6E7176A5D8D9E5EF39317C31';

if(!epgServer){
    epgServer='http://221.179.217.4:33200';
}

*/


function GetQueryString(name,url){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	var r;
	if(url){
		r = url.substr(1).match(reg);
	}else{
		r = window.location.search.substr(1).match(reg);
	}
	if (r!=null && r.length>3 && r[2]!='null')return decodeURIComponent(r[2]); 
	return '';
}

function getServerUrl() {
	console.log('watchTV-ZJ...getServerUrl!start!');
	try {
		var PLUGIN2 = document.getElementById("yst-base-plugin");
		if (PLUGIN2) {
			console.log('getServerUrl->begin');
			var tmpurl;
			tmpurl = '';
			try {
				if (window.widgetmanager && window.widgetmanager.getParameter){
					tmpurl = window.widgetmanager.getParameter('BIMS_FACADE_V2')||'';
					console.log('apk->BIMS_FACADE_V2:' + tmpurl);
				}
			}catch (e){
				console.log('BIMS_FACADE_V2 error:' + e);
				tmpurl= '';
			}
			if (!tmpurl){
				tmpurl = localValue('BIMS_FACADE_V2') ;
			}
			if (!tmpurl && PLUGIN2.getTMSServerUrl){PLUGIN2.getTMSServerUrl("BIMS_FACADE_V2");}
			if (tmpurl && tmpurl != '')vip_ip_v2 = tmpurl;

		}else{
			console.log('getServerUrl->PLUGIN2 error');
		}

		console.log('vip_ip_v2->' + vip_ip_v2);
	} catch (e) {
		console.log('getServerUrl error!' + e.message);
	}
}

function queryInit(){
	console.log('queryInit->');
	try{
		VersionInfo=localValue8200('VersionInfo');
		if(VersionInfo){
			VersionInfo=VersionInfo.replace(/\r\n/g,"");
			VersionInfo=VersionInfo.replace(/\n/g,"");
		}
	}catch(e){console.log('get versioninfo error');}
	console.log('VersionInfo:'+VersionInfo);
	try{
		phone = window.widgetmanager.getParameter('userId');
	}catch (e){
		phone = '';
		console.log('userId->error:' + e);
	}
	try {
		userName= window.widgetmanager.getParameter('username');
	}catch (e){
		userName = '';
		console.log('userName->error:'+e);
	}
	try{
		spToken = window.widgetmanager.getParameter('usertoken')||'';
		console.log('.......get userToken success:'+spToken);
	}catch(e){
		console.log('spToken->error:'+e);
	}
	try {
		deviceMac = window.widgetmanager.getParameter('mac')||'';
	}catch (e){
		deviceMac = '';
		console.log('deviceMac->error:' + e);
	}
	try {
		abilityString = window.widgetmanager.getParameter('BIMS_ABILITY_STRING')||'';
		if (!abilityString){
			abilityString=localCmd('abilityString');
		}
	}catch (e){
		console.log('abilityString->error');
	}
	deviceID = getDeviceId();
	getServerUrl();
}
function localValue(key){
	var url='http://127.0.0.1:8070/Interface.mfg?Cmd=IGetValue&Key='+key;
	var request = new XMLHttpRequest();
	var result='';
	request.open("GET", url, false);
	request.onreadystatechange = function() {
		if(request.readyState == 4) {
			if(request.status == 200) {
				result = request.responseText;
			}else{
				result = '';
			}
		}
	}
	request.send();
	return result;
}
function localCmd(key){
	var url='http://127.0.0.1:8070/Interface.mfg?Cmd=';
	switch(key){
		case 'token':
			url+='IGetToken';
			break;
		case 'loginStatus':
			url+='IGetLoginStatus';
			break;
		case 'deviceID':
			url+='IGetDeviceID';
			break;
		case 'templateId':
			url+='IGetTemplateId';
			break;
        case 'abilityString':
            url+='IGetTMSServerUrl&Srv=BIMS_ABILITY_STRING'
            break;
	}
	var request = new XMLHttpRequest();
	var result='';
	request.open("GET", url, false);
	request.onreadystatechange = function() {
		if(request.readyState == 4) {
			if(request.status == 200) {
				result = request.responseText;
			}else{
				result = '';
			}
		}
	}
	request.send();
	return result;
}
function localValue8200(key){
	var url='http://127.0.0.1:8200/Interface.mfg?Cmd=IGetValue&Key='+key;
    var request = new XMLHttpRequest();
	var result='';
	request.open("GET", url, false);
	request.onreadystatechange = function() {
		if(request.readyState == 4) {
			if(request.status == 200) {
				result = request.responseText;
			}else{
				result = '';
			}
		}
	}
	request.send();
	return result;
}

function init(){
	queryInit();
	regester();
	if (debug){
		vip_ip_v2 = 'http://zj-mobile-ystzw-bss.wasu.tv:8086/yst-ord-api';
		phone = 'njtest005';
	}
}
function regester(){
    snsUserId='';
    try{//taipan6.3增加，否则就使用之前的方法获取匿名用户
        snsUserId=window.widgetmanager.getParameter("payUserId");
        console.log('get the payUserId=snsUserId='+snsUserId);
    }catch(e){console.log('getParameter payUserId error!');}
    return;
	snsUserId=GetQueryString("userId");
	if(snsUserId)return;
    return;
	try{
		var BOxID;
		if(PLUGIN.getUserID && typeof PLUGIN.getUserID == "function"){
			BOxID = PLUGIN.getUserID();
		}
		var url = sns_url+'/box_api/cntv-api/register.php?BoxUid='+BOxID;
		
		var request = new XMLHttpRequest();
		var result='';
		request.open("GET", url, false);
		request.onreadystatechange = function() {
			if(request.readyState == 4) {
				if(request.status == 200) {
					result = request.responseText;
				}else{
					result = '';
				}
			}
		}
		request.send();
		snsUserId = result;console.log('snsUserId='+snsUserId);
	}catch(e){
		console.log(e.message);
		snsUserId=95;
	}
	
}
function getTokenString(){
	try{
		token = localCmd('token')||PLUGIN.getToken();
		console.log(".......get token success:"+token);
	}catch(e){console.log("get token error:"+ e.message);}
};


function maketest(){
	if(window.location.host==='localhost:8080'){
		vip_ip_v2='http://localhost:8080/code/moviePackage2/testdata/sichuan/';
                //bims_ip='http://58.214.17.66:29090/yst-ord-api/';
	}else if(window.location.host==='localhost'){
    accountIdentity='13912345678';
		//accountIdentity = 'xxxssssfff';
		vip_ip_v2='http://localhost/home/testdata/sichuan/';
    }
}

console.log('...................token:'+token+',spToken:'+spToken);
console.log('getServerUrl!!end!vip_ip_v2=='+vip_ip_v2);
console.log('getServerUrl!!end!');
function getDeviceId() {
	var PLUGIN = window.service;
	var _deviceId = '';
	try {
		if (PLUGIN) {
			_deviceId = PLUGIN.getDeviceID();
			console.log("deviceId by service : " + _deviceId);
		}
		else {
			_deviceId = widgetmanager.getParameter('deviceId');
			console.log("deviceId by getParameter : " + _deviceId);
		}
		return _deviceId;
	} catch (ex) {
		_deviceId = '010121009403514';
		console.log("deviceId failed: " + 010121009403514 + "-->" + ex);
		return _deviceId;
	}
}

function string2Json(str) {
	return (str.indexOf('{')==0||str.indexOf('[')==0)?JSON.parse(str):str
	//return (new Function("", "return " + stringFilter(str)))();
}