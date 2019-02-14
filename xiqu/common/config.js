/*
var version = 'WEB_OOSTOPIC_TopicTemplates2016_V1.2.12.27';
 var update = '20181227';
//topicTemplates2016,跳转/CNTV_payment/index.html支持付费节目集
* */
var epg_ip = 'http://epgoos.center.bcs.ottcn.com:8080/yst-epg/web';
//var data_ip = 'http://oldpanel.cntv.ysten.com:8080/ysten-topic';
var data_ip ='http://newpanel.cntv.bcs.ottcn.com:8080/tsop-topic/api/topic';

//是否在新窗口中，打开详情页。true为在新窗口打开，false为在本窗口打开,GetMoiveDetail
var openDetailFlag = false;
//是否在新窗口中，打开EPG页面或者播放器，或者其他页面。true为在新窗口打开，false为在本窗口打开,OpenMicMedia,OpenMedia,GetMicVideosList
var openOtherFlag = false;

//支付
var config={};
var bims_pay_ip = "http://223.82.250.26:8089/onlineMoviePackage/index.html";
var vip_ip = "http://223.82.250.26:8089/yst-ord-api";
config.deviceId= "015184001262595";

var sns_url = "";
var type =2;
if(type == 1) {
    /* 社区地址 */
    sns_url = 'http://localhost/home';
} else {
    sns_url = 'http://sns.is.ysten.com';
}
var fromTo="";
var snsUserId="";
var controlle = "";
var TemplateData = "";
var topicName = "";
function main(){
    if(GetQueryString("userID")){
        snsUserId=GetQueryString("userID");
    }
    if(GetQueryString("fromwhere")){
        fromTo=GetQueryString("fromwhere");
    }
    if(GetQueryString("topicName")){
        topicName=GetQueryString("topicName");
    }
    controlle = new Controlle();
    getTemplateData(topicName,function(__json){
        console.log("*json*:"+__json);
		try{
			TemplateData =eval(__json);
			if(typeof TemplateData != 'object'){
				getTemplateData_sns(topicName,function(__json){
					var noTopicData1 = "<div style='height:82px;line-height:82px;background:url(common/rmb.png) 0px 0px no-repeat;padding-left:120px;font-size:40px;width:400px;margin:250px auto 0px;color:#A4A09B;'>暂无相关信息！</div></div>";
					try{
						TemplateData =eval(__json);
						if(typeof TemplateData != 'object'){
							document.getElementById("box").innerHTML = noTopicData1;
						}
					}catch(e){
						document.getElementById("box").innerHTML = noTopicData1;
						console.log("*TemplateData_sns exception*:"+e);
					}
				})
			}
		}catch(e){
			getTemplateData_sns(topicName,function(__json){
				var noTopicData = "<div style='height:82px;line-height:82px;background:url(common/rmb.png) 0px 0px no-repeat;padding-left:120px;font-size:40px;width:400px;margin:250px auto 0px;color:#A4A09B;'>暂无相关信息！</div></div>";
				try{
					TemplateData =eval(__json);
					if(typeof TemplateData != 'object'){
						document.getElementById("box").innerHTML = noTopicData;
					}
				}catch(e){
					document.getElementById("box").innerHTML = noTopicData;
					console.log("*TemplateData_sns exception*:"+e);
				}
			})
		}
        homeInit();
    })

	try {
		EPG_expose();
	}catch (e){
		console.log('EPG_expose->error:' + e);
	}

}
function keydownfun(event){
    controlle.keyDownFun(event);
}
//获取包含中文在内的字符串长度一个中文长度为二
function getStrLength(str) {
    var cArr = str.match(/[^\x00-\xff]/ig);
    return str.length + (cArr == null ? 0 : cArr.length);
}
//无乱码字符串截取
String.prototype.sub = function (n) {
    var r = /[^\x00-\xff]/g;
    if (this.replace(r, "mm").length <= n) return this;
    // n = n - 3;
    var m = Math.floor(n / 2);
    for (var i = m; i < this.length; i++) {
        if (this.substr(0, i).replace(r, "mm").length >= n) {
            return this.substr(0, i) //+"...";
        }
    }
    return this;
};

//测试开关
var debug = false;