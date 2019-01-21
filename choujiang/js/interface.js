//查询产品包列表
function queryPackageList(callback){
    var ajax = new Ajax();
    var ajaxUrl = vip_ip_v2 + '/v1/user/productList/query';
    var queryStr = 'custId=' + phone + '&deviceMac=' + deviceMac + '&deviceCode=' + deviceID + '&random=' + Math.random();

    ajaxUrl = ajaxUrl + '?' + queryStr;
    console.log('queryPackageList->'+ajaxUrl);
    if (debug){
        //callback(queryPriceData);
        //return;
    }
    //test
    //ajaxUrl = 'http://zj-mobile-ystzw-bss.wasu.tv:8086/yst-ord-api//v1/user/productList/query?deviceMac=58:B4:2D:33:4D:36&source=TV&businessType=VIDEO&custId=ystyy009&version=6612';
    try {
        ajax.get(ajaxUrl , function(json){
            console.log('queryPackageList->result:' + json);
            if (typeof callback == 'function'){
                if (json){
                    callback(string2Json(json));
                }else{
                    callback(null);
                }
            }
        });
    }catch (e){
       console.log('queryPackageList->error:' + e);
    }
}

//查询营销产品包
function queryPromotion(productId,callback){
    var ajax = new Ajax();
    var ajaxUrl = vip_ip_v2 + '/v2/promotion/productId/query';
    var queryStr = 'custId=' + phone + '&productId=' + productId + '&random=' + Math.random();

    ajaxUrl = ajaxUrl + '?' + queryStr;
    console.log('queryPromotion->'+ajaxUrl);
    if (debug){
        callback(null ,productId);
        return;
    }
    try {
        ajax.get(ajaxUrl , function(json){
            console.log('queryPromotion->result:' + json);
            if (typeof callback == 'function'){
                if (json){
                    callback(string2Json(json),productId);
                }else{
                    callback(null,productId);
                }
            }
        });
    }catch (e){
        console.log('queryPromotion->error:' + e);
    }
}

//查询用户是否开通统一支付
function judge(productId, contentId, callback){
    var ajax = new Ajax();
    var ajaxUrl = vip_ip_v2 + '/v1/user/unifiedpayment/judge';
    var queryStr = 'custId=' + phone + '&productId=' + productId + '&contentId=' + contentId + '&random=' + Math.random();

    ajaxUrl = ajaxUrl + '?' + queryStr;
    console.log('judge->'+ajaxUrl);
    if (debug){
        callback(judgeData);
        return;
    }

    try {
        ajax.get(ajaxUrl, function(json){
            console.log('judge->result:' + json);
            if (typeof callback == "function"){
                if (json){
                    callback(string2Json(json));
                }else{
                    callback(null);
                }
            }
        });
    }catch (e){
        console.log('judge->error:' + e);
    }
}

/*
* * 发送验证码接口
* custId:用户主账号
* phone:发送短信的手机号
* type:短信类型。UNTIFYSTATE(统一支付校验状态), ORDER(订购支付)。默认为ORDER
* */
function sendSmsMessage(sendPhone ,callback ,type){
    //type为false时，默认拼接ORDER.type为true时则传值UNTIFYSTATE
    var ajax = new Ajax();
    var ajaxUrl = vip_ip_v2 + '/v1/common/phone/sendCaptcha';
    var _type = 'ORDER';
    if (type){
        _type = 'UNTIFYSTATE';
    }
    var queryStr = 'custId=' + phone + '&phone=' + sendPhone + '&type=' + _type + '&random=' + Math.random();

    ajaxUrl = ajaxUrl + '?' + queryStr;
    console.log('sendSmsMessage->'+ajaxUrl);
    if (debug){
        callback(smsData);
        return;
    }
    try {
        ajax.get(ajaxUrl, function(json){
            console.log('sendSmsMessage->result:' + json);
            if (typeof callback == "function"){
                if (json){
                    callback(string2Json(json));
                }else{
                    callback(null);
                }
            }
        });
    }catch (e){
        console.log('sendSmsMessage->error:' + e);
    }
}

/*
* * 支付接口
* **/
function sendOrder(data ,callback){
    var ajax = new Ajax();
    var ajaxUrl = vip_ip_v2 + '/v1/tv/pay/order';

    var queryStr = '';
    queryStr = queryStr + 'orderNo=' + (data.orderNo || '');
    queryStr = queryStr + '&custId=' + phone;
    queryStr = queryStr + '&userId=' + phone;
    queryStr = queryStr + '&custType=' + (data.custType || '');
    queryStr = queryStr + '&productId=' + (data.productId || '');
    queryStr = queryStr + '&contentId=' + (data.contentId || '');
    queryStr = queryStr + '&promotionId=' + (data.promotionId || '');
    queryStr = queryStr + '&deviceMac=' + deviceMac;
    queryStr = queryStr + '&uid=' + uid;
    queryStr = queryStr + '&payType=' + (data.payType || '');
    queryStr = queryStr + '&payCode=' + (data.payCode || '');
    queryStr = queryStr + '&payPwd=' + (data.payPwd || '');
    queryStr = queryStr + '&verifyCode=' + (data.verifyCode || '');
    queryStr = queryStr + '&spToken=' + (spToken||'');
    queryStr = queryStr + '&version=' + (VersionInfo || '');
    queryStr = queryStr + '&fromChannel=' + (data.fromChannel || '');
    var t = new Date().getTime();
    queryStr = queryStr + '&t=' + t;

    console.log('sendOrder->' + (ajaxUrl + '?' + queryStr));

    try {
        ajax.post(ajaxUrl,queryStr, function(json){
            console.log('sendOrder->result:' + json);
            if (json){
                if (typeof callback == 'function'){
                    callback(string2Json(json));
                }
            }else{
                if (typeof callback == 'function'){
                    callback(null);
                }
            }
        });
    }catch (e){
        console.log('sendOrder->error:' + e);
        callback(null);
    }
}

/* 提示框展示
* success:true标识成功的提示框,false标识失败的提示框
* desc:错误描述信息
* callback:点击确认后的回调函数
* okFun:按ok键时的处理函数
* canelFun:按返回键时的处理函数
* */
function showTips(success , desc , okFun , canelFun, callback,changeImg){
    console.log('showTips->success=' + success + '::desc=' + desc);
    if (success){
        //成功提示
        if (desc){
            $("success_tips_desc").innerHTML = desc;
        }else{
            $("success_tips_desc").innerHTML = "支付成功";
        }
        $("success_tips").style.display = 'block';
        $("error_tips_info").style.display = 'none'
        $("error_tips").style.display = 'none';
    }else if(success=='info'){
        if (desc){
            $("error_tips_desc_info").innerHTML = desc;
        }else{
            $("error_tips_desc_info").innerHTML = "出现错误，请稍后重试";
        }
        $("error_tips").style.display = 'none';
        $("success_tips").style.display = 'none';
        $("error_tips_info").style.display = 'block';
    }else{
        if (desc){
            $("error_tips_desc").innerHTML = desc;
        }else if (changeImg){
            $("error_img_s").src = changeImg;
        }else{
            $("error_tips_desc").innerHTML = "出现错误，请稍后重试";
        }
        $("success_tips").style.display = 'none';
        $("error_tips_info").style.display = 'none'
        $("error_tips").style.display = 'block';
    }

    function keyFn(e){
        console.log('showTips->keyFn:'+ e.keyCode);
        switch (e.keyCode){
            case 13:
                if (success){
                    $("success_tips").style.display = 'none';
                }else if(success=='info'){
                    $("error_tips_info").style.display = 'none';
                }else{
                    $("error_tips").style.display = 'none';
                }
                if (okFun && typeof okFun == "function"){
                    okFun();
                }
                if (typeof callback == 'function'){
                    callback();
                }
            case 27:
                if (success){
                    $("success_tips").style.display = 'none';
                }else if(success=='info'){
                    $("error_tips_info").style.display = 'none';
                }else{
                    $("error_tips").style.display = 'none';
                }
                if (canelFun && typeof canelFun == "function"){
                    canelFun();
                }
                if (typeof callback == 'function'){
                    callback();
                }
                return true;
                break;
        }
    }

    basewidget.setkeyfun(keyFn);
}

/** * localStorage和sessionStorage的封装类
 * 如果使用localStorage这样声明var cache=new Storage;或者var cache=new Storage();或者var cache=new Storage(0);
 * 如果使用sessionStorage这样声明 var cache=new Storage(1);
 */
function Storage(type){
    var object=type?window.sessionStorage:window.localStorage;
    this.set=function(key,value){object.setItem(key,value);};
    this.get=function(key){return object.getItem(key);};
    this.update=function(key,value){object.removeItem(key);object.setItem(key,value);};
    this.remove=function(key){return object.removeItem(key);};
    this.clear=function(){object.clear();};
    this.list=function(){
        var result="";
        var length=object.length;
        for(var i=0;i<length;i++){
            var key=object.key(i);
            var value=object.getItem(key);
            result+=key+":"+value+"<br>";
        }
        return result;
    };
}
function checkPhone(str){//检测手机号
    return /^(1[0-9])\d{9}$/.test(str);
}
//拆分数字键盘key_1，横线后面的id
function getKeyNum(str){
    var result = '';
    if (str){
        //
        result = str.replace('key_','') - 0;
    }
    return result;
}