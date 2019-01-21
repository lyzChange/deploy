var musiclist = null;
//播放器列表
var basewidget;
var uid;
var sl;//套餐列表
var sl2;
var sl3;
var userp;
var userTuiding;
var readapps = {'list':0,'showPackage':0,'userPackages':0,'buy':0,'fav':0,'tuiding':0};
var focus = null;
var cache=null;
var pageinit
var defaultPayType='';
var funcCache={};
function keydownfunc(event){
	focus.keydownfunc(event);
}

function keydownfun(event){
	basewidget.Self_HandleKeyDownEvent(event);
}

function main(){
	if(!cache)cache=new Storage();

	var action = GetQueryString("action");//取到action
	uid = GetQueryString("userID");
	basewidget = new BaseWidget();
	var name = GetQueryString('name');
	var img = GetQueryString("img");
	getPackage();

}
function getPackage(){
	queryPackageList(function(json){
		if (json && json.result == 'ORD-000'){
			//
			if (json.data && json.data.backgroundImg){
				$('body').style.background = 'url('+ json.data.backgroundImg +') no-repeat';
			}
			if (json.data && json.data.productList && json.data.productList.length > 0){
				//存在产品包
				basewidget.do_action('',1,json.data.productList);
			}else{
				//不存在产品，提示错误
				showTips(false,'获取数据失败',function(){
					go_exit();
				})
			}
		}else{
			//数据出错
			showTips(false,'获取数据失败',function(){
				go_exit();
			});
		}
	});
}



function messageSend(flag,str){console.log('messageSend back:'+flag);
	try{
		if(flag==1){
			window.opener.postMessage('success', '*');
		}else if(flag==2){
			window.opener.postMessage('wait', '*');
		}else if(flag==-1){
			window.opener.postMessage('', '*');
		}else if(flag=='appdata'){
            window.opener.postMessage('appdata:'+str,'*');
        }else{
			window.opener.postMessage('error', '*');
			
		}
	}catch(e){}
}
