//config.js 配置文件
//浏览器是否支持跨域，PC不支持，盒子支持
var isCross = true;
var version='WEB_PAY_ZJ_V1.0.8.9';
var versionUpdate='20180925';
var basepath = "http://117.148.139.171:7000/clt/clt/";
//判断用户是否有抽奖机会
var Get_queryUserTVWLotteryInfo ="http://117.148.139.171:7000/clt/clt/queryUserTVWLotteryInfo.msp" //
// 历史数据 下面轮播
var Get_tVWBroadcast ="http://117.148.139.171:7000/clt/clt/tVWBroadcast.msp"
//用来获得billid
var get_queryCustInfo="http://zj-mobile-ystzw-bsu.wasu.tv:8086/yst-lbss-api/queryCustInfo"
//点击抽奖按钮的接口
var get_userTVWLottery="http://117.148.139.171:7000/clt/clt/userTVWLottery.msp"
// let Get_queryUserTVWLotteryInfo ="http://117.148.139.171:7000/clt/clt/queryUserTVWLotteryInfo.msp"
// 转盘抽奖  /userTVWLottery.msp?billId=dnpzcHQwMDEyMDMxMTI=&uuid=123
// 中奖用户 /tVWBroadcast.msp?billId=dnpzcHQwMDEyMDMxMTI=&uuid=123
//转盘查询  /queryUserTVWLotteryInfo.msp?billId=dnN4c3o4MTg1NTk5OTM=&uuid=123
function get_bi_id_() {
    var debug = true;
    var userId = '';
    var getBillId = '';
    try {
        //初始化数据加载
        if (window.widgetmanager){
            userId = window.widgetmanager.getParameter('userId');
        }
    } catch (e) {}
    if(debug){
        // userId="ystyy009";
        userId="7251417674";
    }
    var ajax = new Ajax();
    var ajaxUrl=get_queryCustInfo+"?custId="+userId+'&random=' + Math.random();
    ajax.get(ajaxUrl, function (result) {
        result = JSON.parse(result);
        console.log(result);
        getBillId = result.billId
    });
    // $.ajax({
    //     url: ajaxUrl,
    //     async: false,
    //     success: function (result) {
    //         console.log(result);
    //         getBillId = result.billId
    //         console.log(getBillId);
    //     }
    // });
    return getBillId
}
// var ajax = new Ajax();var ajaxUrl= Get_tVWBroadcast+"?uuid="+123;
// ajax.get(ajaxUrl, function (data) {
//     console.log('eeeeeeeeeeeeeeeeeeeeeeeeeee')
//     // var str = "<dl>";
//     // $.each(data.content.broadList, function (i) {
//     //     str += "<dt>" + data.content.broadList[i].obtainTime + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.content.broadList[i].mobile + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.content.broadList[i].awardName + "</dt>";
//     // });
//     // str += "</dl>";
//     // $(".zj-box").append(str);
//     console.log(data.content.broadList);
    
  
//         data = JSON.parse(data);
//         datas = data;
//         console.log(datas);
  
// });
    



var config = {
    /**多种支付方式支付**/
    "payTypeChoice":{
        "data":[/**顺序请勿随意变更**/
            {"name":"关联手机号支付"	,"key":"UNTIFY","showTip":"手机号"},
            {"name":"其他手机号支付"	,"key":"PHONE","showTip":"手机号","isDefault":true},
            {"name":"微信支付"	,"key":"WEIXIN","showTip":"请用手机扫描二维码<br>完成支付<br>（选中二维码放大）"},
        ],
    },
    "errorMsg":{
        "phone":"请输入正确的手机号码",//手机号输入不合法,
        "checkMsg":"请输入正确的验证码",//验证码输入错误
        "default":"发生错误",//默认错误提示框
    },
    "payTimeOut":10,//支付接口超时时间设置,单位为秒
    "payInterval":5,//支付时，防止连续点击支付按钮的丢键时间，单位为秒
}
//测试模式,务必保持为false！！！！
var debug = false;
var debugData = {
    "spToken":"",
}
