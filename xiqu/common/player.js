/************专题跳转************/
var backUrl = "";//返回专题地址
var name = "";//当前专题名称
var panelId = getQueryString('panelId')||'';

//OpenTrailerMedia：播放预告片，播放预告片视频，点击后跳转至播放详情页
//OpenUrl：专题，跳转至指定专题连接 --新增
//OpenCatgItem：栏目，进入列表页   --新增
//OpenApk：打开应用
//GetMoiveDetail：详情页
//OpenMedia：播放视频，为视频推荐位，点击后直接全屏播放
//GetMicVideosList：微视频节目集播放页，通过节目集或节目id进入小窗口播放
//OpenMicMedia：播放微视频，通过节目集或节目id直接全屏播放
//getTemplate：自定义，跳转至指定连接
//OpenSpoor：足迹
//OpenSearch：搜索
//OpenPay：订购
function Play(action,actionURL,epgId, appStr){
	console.log(action)
	if(action =="OpenMicMedia"){
		if(epgId){
			if (openOtherFlag){
				window.open(sns_url+"/CNTV_payment/index.html?action=play&type=5&userID="+snsUserId+"&programId="+actionURL+"&fromwhere=playRecords&object={EPGID:'"+epgId+"'}");
			}else{
				window.location.href=sns_url+"/CNTV_payment/index.html?action=play&type=5&userID="+snsUserId+"&programId="+actionURL+"&fromwhere=playRecords&object={EPGID:'"+epgId+"'}";
			}
			try{
				player_click(epgId,actionURL);
			}catch (e){
				console.log('player_click->error:' + e);
			}
		}else{
			if (openOtherFlag){
				window.open(sns_url+"/CNTV_payment/index.html?fromwhere=playRecords&action=play&type=5&object=" + actionURL + "&userID=" + snsUserId);
			}else{
				window.location.href = sns_url+"/CNTV_payment/index.html?fromwhere=playRecords&action=play&type=5&object=" + actionURL + "&userID=" + snsUserId;
			}
			try{
				player_click(actionURL);
			}catch (e){
				console.log('player_click->error:' + e);
			}
		}
	}else if(action =="OpenMedia"){
		//给定播放地址直接播放
		if (openOtherFlag){
			window.open(sns_url+"/CNTV_payment/index.html?action=play&type=3&userID="+snsUserId+"&fromwhere=playRecords&object={actionURL:'"+encodeURIComponent(actionURL)+"'}");
		}else{
			window.location.href=sns_url+"/CNTV_payment/index.html?action=play&type=3&userID="+snsUserId+"&fromwhere=playRecords&object={actionURL:'"+encodeURIComponent(actionURL)+"'}";
		}
		//window.location.href=sns_url+"/CNTV_payment/index.html?action=play&type=3&userID="+snsUserId+"&fromwhere=playRecords&object={actionURL:'"+encodeURIComponent(actionURL)+"'}";
		try{
			//player_click(actionURL);
			fun_click(actionURL);
		}catch (e){
			console.log('fun_click->error:' + e);
		}
    }else if(action =="GetMoiveDetail"){
		var detailUrl=sns_url + "/CNTV_payment/index.html?action=detail&userID="+snsUserId+"&fromwhere=playRecords&object="+actionURL + '&topicId=' + topicName + '&panelId=' + panelId;
		try{
			player_click(actionURL);
		}catch (e){
			console.log('player_click->error:' + e);
		}
		//callAndroid("OpenUrl",detailUrl);
		setTimeout(function(){
			callAndroid("OpenUrl",detailUrl);
		},50)
	}else if(action =="GetMicVideosList"){
		if(epgId){
			if (openOtherFlag){
				window.open(sns_url + "/CNTV_payment/index.html?action=play&type=2&userID=" + snsUserId + "&fromwhere=playRecords&object="+epgId+"&programId="+actionURL);
			}else{
				window.location.href = sns_url + "/CNTV_payment/index.html?action=play&type=2&userID=" + snsUserId + "&fromwhere=playRecords&object="+epgId+"&programId="+actionURL;
			}
			//window.location.href = sns_url + "/CNTV_payment/index.html?action=play&type=2&userID=" + snsUserId + "&fromwhere=playRecords&object="+epgId+"&programId="+actionURL;
			try{
				player_click(epgId ,actionURL);
			}catch (e){
				console.log('player_click->error:' + e);
			}
		}else{
			if(openOtherFlag){
				window.open(sns_url+"/CNTV_payment/index.html?fromwhere=playRecords&action=play&type=2&object=" + actionURL + "&userID=" + snsUserId);
			}else{
				window.location.href = sns_url+"/CNTV_payment/index.html?fromwhere=playRecords&action=play&type=2&object=" + actionURL + "&userID=" + snsUserId;
			}
			//window.location.href = sns_url+"/CNTV_payment/index.html?fromwhere=playRecords&action=play&type=2&object=" + actionURL + "&userID=" + snsUserId;
			try{
				player_click(actionURL);
			}catch (e){
				console.log('player_click->error:' + e);
			}
		}
	}else if(action =="OpenApk"){
		console.log('传入的appstr: ' + appStr);
		jump(appStr);
	}
}

// 跳转第三方apk
var jump = function(jumpPath){
    window.widgetmanager.launchApp("Android",jumpPath, "", true);
}
/**调用安卓**/
function callAndroid(action,targetUrl){

     if(isOpenAndroid()){
        if (window.widgetmanager && window.widgetmanager.launchApp) {
            window.widgetmanager.launchApp(action, targetUrl, "", true);
        }
     }else{
		 if(openDetailFlag){
			 //再新窗口打开
			 window.open(targetUrl);
		 }else{
			 window.location.href = targetUrl;
		 }
     }
}
/**判断是否taipan版本**/

function isOpenAndroid(){
    var browserId='';
    try{
        browserId=window.widgetmanager.getParameter('browserId');
    }catch(e){
        console.log('can not use getParameter');
    }
    console.log('get the browserId:'+browserId);
    if(!browserId)return false;
    return true;
}
/**
**返回
*name为专题名称，如果name="panel"则回到panel首页
**/
function goBack(name){
	if(name == "panel"){
		if(window.widget && window.widget.exit) {
				window.widget.exit();
			} else {
				window.close();
			}
	}else{
		window.location.href=sns_url + "/topic2016/index.html?userID="+ snsUserId +"&name="+name;
	}
}

/*跳转其他页面*/
function runPage(url){
	if (url){
		try{
			fun_click(url);
		}catch (e){
			console.log('runPage->fun_click->error:' + e);
		}

		setTimeout(function(){
			location.href = url;
		},60);
	}
}
