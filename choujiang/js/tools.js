/*公用模块*/
var modules={//变量可引申为全局变量
	canPointSearch:true,//是否可以积分查询
	canReSend:true,		//是否可以发短信
	/**限制订单提交，10分钟3次**/
	checkWaitTime:function(conf,data){//10分钟内不允许重复提交3次
		if(!conf || !conf.open)return true;
		var min_checkWaitTime=conf.limitTime;//10分钟
		var count_checkWaitTime=conf.limitNum;//3次
		var errcode=conf.errcode||'';
		var lockTime=conf.lockTime||0;//锁定时间
		var fields=conf.limitFields?fields=conf.limitFields.split(','):[];
		var len_fields=fields.length;

		var waitTimeData_new='';
		var waitTimeData=cache.get(conf.catchName);
		var now=new Date();
		var count_i=0;
		var lockCount=0;
		if(waitTimeData&&waitTimeData!='null'){
			var waitTimeDatas=waitTimeData.split('|');
			for(var i=0;i<waitTimeDatas.length;i++){
				if(!waitTimeDatas[i])continue;
				var item_datas=waitTimeDatas[i].split(',');
				if(item_datas.length<len_fields+1)continue;
				if(min_checkWaitTime
					&& now.getTime()>=parseInt(item_datas[0])+min_checkWaitTime
				)continue;//超过10分钟的忽略
				if(lockTime && now.getTime()<=parseInt(item_datas[0])+lockTime){
					lockCount++;
				}
				var isHaveData=true;
				for(var j=0;j<len_fields;j++){
					if(item_datas[j+1]!=data[fields[j]]){
						isHaveData=false;
						break;
					}
				}
				if(isHaveData){
					count_i++;
					if(count_i>=count_checkWaitTime
						&& !(lockTime && lockCount>0)
					){
						return false;
					}
				}
			}
		}
		return true;
	},
	saveWaitTime:function(json,conf,data){
		if(!conf || !conf.open)return;
		var min_checkWaitTime=conf.limitTime;//10分钟
		var count_checkWaitTime=conf.limitNum;//3次
		var errcode=conf.errcode||'ORD-000';//判断code
		var lockTime=conf.lockTime||0;//锁定时间
		var lockCount=0;
		var fields=conf.limitFields?conf.limitFields.split(','):[];
		var len_fields=fields.length;

		var waitTimeData=cache.get(conf.catchName);
		var waitTimeData_new='';
		var now=new Date();
		if(waitTimeData&&waitTimeData!='null'){
			var waitTimeDatas=waitTimeData.split('|');
			for(var i=0;i<waitTimeDatas.length;i++){
				var item_datas=waitTimeDatas[i].split(',');
				if(item_datas.length<len_fields+1)continue;
				if(min_checkWaitTime
					&& now.getTime()>=parseInt(item_datas[0])+min_checkWaitTime
				)continue;
				if(lockTime && now.getTime()<=parseInt(item_datas[0])+lockTime){
					lockCount++;
				}
				waitTimeData_new+=waitTimeDatas[i]+'|';
			}
		}
		if(lockTime && lockCount==0){
			waitTimeData_new='';
		}
		if(errcode && errcode!=json.result){
			waitTimeData_new='';
			cache.set(conf.catchName,'');
			return;
		}
		var str=now.getTime();
		for(var i=0;i<len_fields;i++){
			str+=','+data[fields[i]];
		}
		waitTimeData_new+=str+'|';
		cache.set(conf.catchName,waitTimeData_new);
	},
	/**保存手机号码到cookie**/
	cookiename_phones:'saved_phones',
	getCookiePhones:function(){
		var cookiePhones=[];
		var str_cookiePhones=cache.get(this.cookiename_phones);
		if(str_cookiePhones&&str_cookiePhones!='null'){
			cookiePhones=str_cookiePhones.split('|');
		}
		return cookiePhones;
	},
	setPhoneCookie:function(phonenum){
		var len_savePhone=config.len_savePhone;
		var strcookiePhones=cache.get(this.cookiename_phones);
		var cookiePhone_str=phonenum;

		if(strcookiePhones&&strcookiePhones!='null'){
			cookiePhones = strcookiePhones.split('|');
			var cache_length=1;
			for(var i=0;cache_length<len_savePhone && i<cookiePhones.length;i++){
				if(phonenum==cookiePhones[i])continue;
				cookiePhone_str+='|'+cookiePhones[i];
				cache_length++;
			}
		}
		cache.set(this.cookiename_phones,cookiePhone_str);
	},
	/**倒计时**/
	countdown:function(max,min,callback_i,callback_finish){
		var i=max;
		callback_i.call(this,i);
		i--;
		var interval_countdown=setInterval(function(){
			if(i<=min){
				callback_finish.call(this);
				clearInterval(interval_countdown);
				return;
			}
			callback_i.call(this,i);
			i--;
		},1000);
	},
	gotoCNTVPlay:function(epgid){
        if(this.isOpenAndroid()){
            var type='OpenUrl';
            var url='http://sns.is.ysten.com/CNTV/index.html?action=detail&object='+epgid;
            if (window.widgetmanager && window.widgetmanager.launchApp) {
                window.widgetmanager.launchApp('OpenUrl', url, "", true);
            }
        }else{
            //url+='?action=detail&object='+epgid+'&userID='+snsUserId;
            var url=config.CNTVfolder;
            url+='?action=play&type=5&object='+epgid+'&fromwhere=records&userID='+snsUserId;
            console.log('open play url:'+url);
            window.location.href=url;
        }
	},
    isOpenAndroid:function(){//判断是否taipan版本
        var browserId='';
        try{
            browserId=window.widgetmanager.getParameter('browserId');
        }catch(e){
            console.log('can not use getParameter');
        }
        console.log('get the browserId:'+browserId);
        if(!browserId)return false;
        return true;
    },
	/**支付结果发送信息给安卓**/
	queryData:'',//轮询订单的结果
	payResult2Android:function(payStatus,payResult){
        if(payStatus==0&&this.queryData){
            //传递信息给app
            messageSend('appdata','{"payType":"'+payType+'"}');
        }
        try{
            var sendStr=2;
            if(payStatus==0 && ['PHONE','POINT','ETICKET'].indexOf(payType)==-1){
                sendStr=1;
            }
            console.log('sendMsg2Android key:paystatus,value:'+sendStr);
            window.gefoAndroid.sendMsg2Android('paystatus',''+sendStr+'');
        }catch(e){
            console.log("onlineMoviePackage tools.js is notfind 'window.gefoAndroid.sendMsg2Android(paystatus)'");
        }
		var args=pageinit.getArgs();
		if(args.businessType=='GAME'){
			var queryInterval='',
			queryTimes='',
			sequenceId='',
			billType=args.billType?args.billType:'',
			queryData=this.queryData.replace(/"/gi,'\\"');

			if(payResult){
				sequenceId=payResult.sequenceId?payResult.sequenceId:'';
				if(payResult.reserve){
					if(typeof payResult.reserve == 'string'){
						try{
							payResult.reserve=JSON.parse(payResult.reserve);
						}catch(e){}
					}
					queryInterval=payResult.reserve.queryInterval?payResult.reserve.queryInterval:'';
					queryTimes=payResult.reserve.queryTimes?payResult.reserve.queryTimes:'';
				}
			}


			var sendKey='game';
			var sendStr='{"result":"'+payStatus+'","billType":"'+billType+'","sequenceId":"'+sequenceId+'","queryInterval":"'+queryInterval+'","queryTimes":"'+queryTimes+'","queryData":"'+queryData+'"}';
			//sendStr='{"result":"0","sequenceId":"201511200001","queryInterval":"30","queryTimes":"20"}';
			console.log('send2Android key:'+sendKey+',value:'+sendStr);
			try{
				window.gefoAndroid.sendMsg2Android(sendKey,sendStr);
			}catch(e){
				console.log("onlineMoviePackage tools.js is notfind 'window.gefoAndroid.sendMsg2Android'");
			}
		}
	},

};

function ScrollList(id,width,height,size,source){
	this.containerId = id;//容器id
	this.source = source;//数据源
	this.sourceIndex = 0;//数据索引
	this.size = parseInt(size);//容量
	this.loop = false;//循环标识
	this.width = width;//容器宽度
	this.height = height;//容器高度
	this.box = parseInt(size) + 2;//创建组件数
	this.boxWidth;//组件宽度
	this.boxHeight;//组件高度
	this.childFocus;//组件获得焦点
	this.childBlur;//组件失去焦点
	this.focusIndex;//组件焦点索引
	this.focusLeft;
	this.focusObj;//当前对象
	this.preObj;//上一个对象
	this.boxWidth = parseInt(this.width/this.size);
	this.boxHeight = this.height;
	this.moveOver = true;
	this.focusGroup = 'list';//焦点在list底部列表loading提交进度条success提交成功error失败
	this.buySchedule = 0;//购买进度-进度条百分比

}
ScrollList.prototype = {
	init : function(){
		var html = '';
		$(this.containerId).style.width = this.boxWidth*this.source.length+'px';
		var fragment = document.createDocumentFragment();
		for(var i=0;i<this.source.length;i++){
			var temp = this.item_show(this.source[i],i);
			fragment.appendChild(temp);
			temp = null;
		}
		$(this.containerId).innerHTML = '';
		$(this.containerId).appendChild(fragment);
		fragment = null;
		this.focusIndex = 0;
		this.focusLeft=0;

		if(this.size<this.source.length){
			SOH('buyPackage_left','none');
			SOH('buyPackage_right','block');
		}else{
			SOH('buyPackage_left,buyPackage_right','none');
		}
		//$(this.containerId).innerHTML = html;
		this.focusObj = $(this.containerId).children[this.focusIndex];
		this.childFocus(this.focusObj);
	},

	item_show:function(o,i){},

	filling : function(obj,index){
		if(index<0||index==this.source.length)return;
		obj.children[0].innerText = this.source[index].title;
		obj.children[1].children[0].src = this.source[index].img;
		if(this.source[index].vip=='1'){
			obj.children[1].children[1].style.display = 'block';
		}else{
			obj.children[1].children[1].style.display = 'none';
		}
	},

	destory : function(){
		$(this.containerId).innerHTML = '';
	},

	show : function(flag){
		if(flag){
			$(this.containerId).style.display = '';
		}else{
			$(this.containerId).style.display = 'none';
		}
	},
	focusIn : function(){},

	focurOut : function(){},

	addFocus : function(fun){
		this.childFocus = fun;
	},

	addBlur : function(fun){
		this.childBlur = fun;
	},

	key_back : function(){},
	key_up:null,

	keydown : function(event){
		if(!this.move){
			g_callback_keyfun.call(g_callback_keytarget,event);
			return;
		}
		switch(event.keyCode){
			case KEY_BACK:
				return this.key_back();
				break;
			case KEY_ENTER:
				if(this.focusGroup == 'list'){
					this.buyPackage();
				}
				break;
			case KEY_LEFT:
				if(this.focusGroup=='list'){
					this.move(-1);
				}

				break;
			case KEY_UP:
                if(this.key_up){
                    this.childBlur(this.focusObj);
                    this.key_up();
                }
				break;
			case KEY_RIGHT:
				if(this.focusGroup=='list'){
					this.move(1);
				}
				break;
			case KEY_DOWN:
				break;
		}
	},

	buyPackage : function(){//购买操作

	},

	getLeft : function(obj){
		return parseInt(obj.style.left);
	},

	setLeft : function(obj,num){
		obj.style.left = num + 'px';
	},

	move : function(pos){
		if(!this.moveOver)return;
		var __this = this;
		this.preObj = this.focusObj;
		if(pos > 0){//索引增加：right
			this.sourceIndex++;
			if(this.sourceIndex==this.source.length){
				this.sourceIndex=this.source.length-1;
				if(!this.loop)return;
			}
			this.focusIndex++;
			this.focusLeft++;
			if(this.focusLeft>=this.size){
				this.focusLeft--;
				var left = parseInt($(this.containerId).style.left.replace('px',''));
				this.moveOver = false;

				$(this.containerId).style.left = (left - this.boxWidth)+'px';
				if(this.focusIndex<this.source.length-1){
					//$('buyPackage_right').className = 'cur';
					SOH('buyPackage_right','block');
				}else{
					//$('buyPackage_right').className = '';
					SOH('buyPackage_right','none');
				}
				//$('buyPackage_left').className = 'cur';
				SOH('buyPackage_left','block');
				setTimeout(function(){
					__this.moveOver = true;
				},200);
			}
			this.focusObj = $('buyPackage_li_'+this.focusIndex);
			this.childBlur(this.preObj);
			this.childFocus(this.focusObj);

		}else if(pos < 0){//索引减少：left
			this.sourceIndex--;
			if(this.sourceIndex<0){
				this.sourceIndex=0;
				if(!this.loop)return;
			}
			this.focusIndex--;
			this.focusLeft--;
			if(this.focusIndex<0){
				this.focusIndex = this.box - 1;
			}
			if(this.focusLeft<0){
				this.focusLeft++;
				var left = parseInt($(this.containerId).style.left.replace('px',''));
				this.moveOver = false;
				$(this.containerId).style.left = (left+this.boxWidth)+'px';
				if(this.focusIndex>0){
					//$('buyPackage_left').className = 'cur';
					SOH('buyPackage_left','block');
				}else{
					//$('buyPackage_left').className = '';
					SOH('buyPackage_left','none');
				}
				//$('buyPackage_right').className = 'cur';
				SOH('buyPackage_right','block');
				setTimeout(function(){
					__this.moveOver = true;
				},200);
			}

			this.focusObj = $('buyPackage_li_'+this.focusIndex);
			this.childBlur(this.preObj);
			this.childFocus(this.focusObj);
		}
	}
}

function ScrollList2(containerId,favListID){
	this.source = [];
	this.containerId = containerId;				//收藏列表所在容器
	this.pageSize = 7;							//页面中显示的个数
	this.pageNum = 1;							//页数
	this.recordCount = 0;						//总体元素个数
	this.pageCount = 0;							//总页码

	this.itemHeight = 64;						//每个元素的高度
	this.favListTop = 0;							//列表顶部和屏幕距离的元素个数
	this.favListID = favListID;		//具体列表的id
	this.pageAllCanNoRenew = false;	//当前页是否全部都不允许续订
	this.maxNum = 0;							//结点数量
	this.focusObj = null;						//焦点对象
	this.focusIndex = -1;						//焦点指针
	this.oldIndex = -1;
	this.focusFun = "play";						//当前焦点的功能（play或del）
	this.isCanFanye = true;						//当前能翻页
	this.scrooltime = '0.5s';					  //翻页滚动所用的时间

	//监听翻页滚动效果
	var transitionEnd = (navigator.vendor && "webkitTransitionEnd") || ( window.opera && "oTransitionEnd") || "transitionend";
	var __this = this;
	$(this.favListID).addEventListener(transitionEnd,function(event){return __this.transitionEndListen();},false);
}
ScrollList2.prototype = {
	init : function(source){
		if(source){
			this.source=[];
			this.source.length=0;
			this.source=source;
		}
		if(!this.source)return;


		this.recordCount = this.source.length;
		this.pageNum=1;
		this.favListTop=0;

		if(this.recordCount % this.pageSize == 0){
			this.pageCount = this.recordCount / this.pageSize;
		}else{
			this.pageCount = parseInt(this.recordCount / this.pageSize) + 1;
		}
		console.log('recordCount:'+this.recordCount+',pageCount:'+this.pageCount);

		var html = '';

		$(this.containerId).innerHTML = html;
		$(this.favListID).style.marginTop = 0;
		this.show(true);

		this.loadPage(this.pageNum,0);		//加载第一个页面
		this.loadPage(this.pageNum+1,1);	//加载下一个页面
		//this.loadPage(this.pageNum,-1);	//加载前一个页面

		//this.focusIndex = 0;
		//	this.move(0);
		this.onpagechange.call(this);
	},
	/** 加载列表
	 * @param pageNum 加载的页面
	 * @param tag 加载的位置，0当前位置，1当前位置之后，-1当前位置之前
	 */
	loadPage : function(pageNum,tag){
		if(pageNum<=0)return;
		if(pageNum>this.pageCount)return;
		var pageSize = this.pageSize;
		if(tag==undefined){
			tag = this.pageNum - pageNum;
		}
		var html = '';
		for(var i=(pageNum-1) * pageSize;i<pageNum * pageSize && i<this.recordCount;i++){
			html += this.item_show(this.source[i],i);
		}
		if(tag==0){
			$(this.favListID).innerHTML = html;
		}else if(tag<0){
			$(this.favListID).innerHTML = html + $(this.favListID).innerHTML;
		}else if(tag>0){
			$(this.favListID).innerHTML = $(this.favListID).innerHTML + html;
		}

	},
	focusIn : function(){
		this.move(0);
		/*if(this.source[this.focusIndex].isBtn){
			this.move(1);
		}*/
	},
	focusOut : function(){
		if(this.source[this.focusIndex]&&this.source[this.focusIndex].isBtn){
			this.onblur.call(this,this.focusIndex);
		}
	},
	/**按键上下移动操作，0不挪动，1向下，-1向上 */
	move : function(changeIndex){
		if(!this.isCanFanye)return;
		this.changeIndex = changeIndex;
		this.oldIndex = this.focusIndex;
		this.onblur.call(this,this.oldIndex);

		if(changeIndex==0){//不需要移动的情况，用于初始化
			this.fanye();
			return;
		}
		if(this.pageAllCanNoRenew){//当前页没有按钮，直接翻页
			this.fanye();
		}else{
			var minX = this.pageSize*(this.pageNum-1);
			var maxX = this.pageSize*this.pageNum;

			this.focusIndex = this.focusIndex + this.changeIndex;
			if(!this.source[this.focusIndex]||!this.source[this.focusIndex].isBtn||this.focusIndex<0||this.focusIndex>this.recordCount-1){
				var i=this.focusIndex;
				this.focusIndex = -1;
				for(;i>=minX&&i<maxX&&i<this.recordCount;i=i+this.changeIndex){
					if(this.source[i].isBtn){
						this.focusIndex=i;
						break;
					}
				}
			}
			if(this.focusIndex==-1){
				if(this.changeIndex<0 && this.pageNum<=1){
					this.fanye();
					return;
				}
				if(this.changeIndex<0 && this.pageNum>1){
					this.focusIndex = minX-1;
				}else if(this.changeIndex>0 && this.pageNum<this.pageCount){
					this.focusIndex = maxX+1;
				}else{
					this.focusIndex = this.oldIndex;
				}
			}

			if (this.focusIndex + this.favListTop > this.pageSize - 1){//向下翻页
				this.fanye();
			}else if(this.focusIndex + this.favListTop < 0) {//向上翻页
				this.fanye();
			}else{
				this.onfocus.call(this,this.focusIndex);
			}
		}
	},
	fanye : function(){
		if(this.changeIndex<0&&this.pageNum==1){
			if(this.onkeyup){
				this.onkeyup.call(this);
			}
			return;
		}

		$(this.favListID).style['-webkit-transition'] = this.scrooltime;
		var startX=minX = this.pageSize*(this.pageNum-1);
		var maxX = this.pageSize*this.pageNum;
		if(this.changeIndex>0 && this.pageNum+1<=this.pageCount){
			this.isCanFanye = false;
			this.pageNum += 1;
			//实现动画向上滚动列表高度为：this.pageSize*this.itemHeight
			$(this.favListID).style.marginTop = this.str2numadd2str($(this.favListID).style.marginTop, (-1) * this.pageSize * this.itemHeight) + 'px';
			this.favListTop -= this.pageSize;
			startX=minX= this.pageSize*(this.pageNum-1);
			maxX = this.pageSize*this.pageNum;
		}else if(this.changeIndex<0 && this.pageNum-1>0){
			this.isCanFanye = false;
			this.pageNum -= 1;
			//实现动画向下滚动列表高度为this.pageSize*this.itemHeight
			$(this.favListID).style.marginTop = this.str2numadd2str($(this.favListID).style.marginTop, this.pageSize * this.itemHeight) + 'px';
			this.favListTop += this.pageSize;
			startX= this.pageSize*this.pageNum-1;
			minX = this.pageSize*(this.pageNum-1);
			maxX = this.pageSize*this.pageNum;
		}else{
			this.changeIndex = 1;
		}
		var oldIndex=this.focusIndex;
		this.focusIndex=-1;
		for(var i=startX;i<maxX && i>=minX && i<this.recordCount && i>=0;i=i+this.changeIndex){//console.log('i:'+i);
			if(this.source[i].isBtn){
				this.focusIndex = i;
				break;
			}
		}

		if(this.focusIndex==-1){
			this.focusIndex=startX;
			this.pageAllCanNoRenew = true;
		}else{
			this.pageAllCanNoRenew = false;
			if(this.isCanFanye){
				this.onfocus.call(this,this.focusIndex);
			}
		}
		this.onpagechange.call(this);
	},
	/** 滑动事件监听 */
	transitionEndListen : function(){
		this.isCanFanye = false;
		$(this.favListID).style['-webkit-transition']='none';

		//console.log('监听之前：focusIndex:'+this.focusIndex+',favListTop:'+this.favListTop+',pageNum:'+this.pageNum);
		if (this.changeIndex>0){
			if(this.pageNum>2){
				var _delStartNum = (this.pageNum - 3) * this.pageSize + 1;
				var _delEndNum = (this.pageNum - 2) * this.pageSize + 1;
				for (var i = _delStartNum; i < _delEndNum; i++) {
					$(this.favListID).removeChild($('mli_' + i));
				}
				$(this.favListID).style.marginTop = this.str2numadd2str($(this.favListID).style.marginTop, this.pageSize * this.itemHeight) + 'px';
			}
			if(this.pageNum<this.pageCount){
				this.loadPage(this.pageNum+1,1); //加载后边的页面（如果扩展加载页数从此处扩展）
			}
		}else if(this.changeIndex<0){
			if(this.pageCount>2 && this.pageNum<this.pageCount-1){
				var _delStartNum = (this.pageNum + 1) * this.pageSize + 1;
				var _delEndNum = (this.pageNum + 2) * this.pageSize + 1;
				for (var i = _delStartNum; i < _delEndNum && i <= this.recordCount; i++) {
					$(this.favListID).removeChild($('mli_' + i));
				}
			}
			if(this.pageNum>1){
				this.loadPage(this.pageNum-1,-1);
				$(this.favListID).style.marginTop = this.str2numadd2str($(this.favListID).style.marginTop, (-1) * this.pageSize * this.itemHeight) + 'px';
			}
		}
		this.isCanFanye = true;
		this.onfocus.call(this,this.focusIndex);
		//console.log('监听之后：focusIndex:'+this.focusIndex+',favListTop:'+this.favListTop+',pageNum:'+this.pageNum);
	},
	keydown : function(e){
		if(!this.isCanFanye)return;
		var _this = this;
		var current_index = (this.pageNum-1)*this.pageSize+this.focusIndex+this.favListTop;
		switch (e||e.keyCode) {
		case KEY_BACK:
			break;
		case KEY_ENTER: //enter
			this.goclick();
			break;
		case KEY_LEFT: //left

			break;
		case KEY_RIGHT: //right
			break;
		case KEY_UP: //up
			if(this.focusIndex==0&&this.pageNum==1){
				if(this.onkeyup){
					this.onkeyup.call(this);
				}
				return;
			}
			this.move(-1);
			break;
		case KEY_DOWN: //down
			if ((this.pageNum - 1) * this.pageSize + this.focusIndex + this.favListTop == this.recordCount - 1) {
				this.onkeydown.call(this);
				return;
			}
			this.move(1);
			break;
		}
		//console.log('pageNum:'+this.pageNum+',pageSize:'+this.pageSize+',focusIndex:'+this.focusIndex+',favListTop:'+this.favListTop);
	},
	onkeyup:function(){},//顶部
	onkeydown:function(){},//底部
	goclick : function(){},
	item_show:function(source,i){},//每一项的样式，并判断是否有按钮在source中设置isBtn
	onfocus:function(i){},
	onblur:function(i){},
	onpagechange:function(){},//页码更改
	/** 删除操作 */
	delMusicFav : function(){
		var weizhiid = (this.pageNum-1)*this.pageSize + this.favListTop + this.focusIndex + 1;
		$(this.favListID).removeChild($('mli_'+weizhiid));
		this.arrayData.splice(weizhiid-1,1);
		this.recordCount--;
		if(weizhiid-1==this.recordCount){
			this.focusIndex-=1;

		}
		if(this.recordCount % this.pageSize == 0){
			this.pageCount = this.recordCount / this.pageSize;
		}else{
			this.pageCount = parseInt(this.recordCount / this.pageSize) + 1;
		}
		this.loadPage(this.pageNum,0);
		if(this.pageNum>1){
			this.loadPage(this.pageNum-1,-1);
		}
		this.loadPage(this.pageNum+1,1);
		this.move(0);
	},
	/** 销毁操作 */
	destroy : function(){
		$(this.containerId).innerHTML = '';
	},
	setPageSize : function(pageSize){
		this.pageSize = pageSize;
	},
	show : function(flag){
		if(flag){
			$(this.containerId).style.display = '';
		}else{
			$(this.containerId).style.Display = 'none';
		}
	},
	str2numadd2str : function(_num1,addnum){
		_num2 = _num1.replace('px','');
		_num2 = parseInt(_num2);
		_num2 = _num2 + addnum;
		return _num2;
	},
	substr : function(str, len){//根据字节截取字符串
		if( !str || !len){
			return '';
		}
		// 预期计数：中文2字节，英文1字节
		var a = 0;// 循环计数
		var i = 0;// 临时字串
		var temp = '';
		for (i = 0; i < str.length; i ++ ){
			if (str.charCodeAt(i) > 255){
				a += 2;// 按照预期计数增加2
			}else{
				a ++ ;
			}
			// 如果增加计数后长度大于限定长度，就直接返回临时字符串
			if(a > len){
				return temp+'..';
			}
			// 将当前内容加到临时字符串
			temp += str.charAt(i);
		}
		// 如果全部是单字节字符，就直接返回源字符串
		return str;
	},
}

/** 单选按钮 **/
function radioList(containerId){
    this.containerId=containerId;
    this.data=null;
    this.row=4;
    this.rowcount=0;
    this.focusID=0;
    this.selectID=0;

    this.catchSelect=null;
    this.catchDown=null;
    this.catchUp=null;
    this.catchLeft=null;
}
radioList.prototype={
    init:function(_data,conf){
        this.data=_data;
        this.selectID=-1;
        if(conf){
            if(conf.row)this.row=conf.row;
            if(conf.selectID)this.selectID=conf.selectID;
        }
        var str='';
        for(var i=0,n=_data.length;i<n;i++){
            str+='<span>'+_data[i]['name']+'<del></del></span>';
        }
        this.rowcount=Math.ceil(_data.length/this.row);
        $(this.containerId).innerHTML=str;
        this.show(true);
        this.doSelect(0);
    },
    keydown:function(keyCode){
        switch(keyCode){
        case KEY_BACK:
            break;
        case KEY_LEFT:
            if(this.focusID%this.row==0){
                if(this.catchLeft /*&& this.catchLeft()*/){
					this.catchLeft();
                    this.blur(this.focusID);
                }
            }else if(this.focusID>0){
                this.blur(this.focusID);
                this.focusID--;
                this.focus(this.focusID);
            }
            break;
        case KEY_RIGHT:
            if(this.focusID<this.data.length-1){
                this.blur(this.focusID);
                this.focusID++;
                this.focus(this.focusID);
            }
            break;
        case KEY_UP:
            if(Math.ceil((this.focusID+1)/this.row)>1){
                this.blur(this.focusID);
                this.focusID-=this.row;
                this.focus(this.focusID);
            }else if(this.catchUp){
                this.blur(this.focusID);
                this.catchUp.call();
            }
            break;
        case KEY_DOWN:
            if(Math.ceil((this.focusID+1)/this.row)==this.rowcount){
                if(this.catchDown){
                    this.blur(this.focusID);
                    this.catchDown.call();
                }
            }else{
                this.blur(this.focusID);
                this.focusID+=this.row;
                if(this.focusID>this.data.length-1){
                    this.focusID=this.data.length-1;
                }
                this.focus(this.focusID);
            }
            break;
        case KEY_SELECT:
        case KEY_ENTER:
            this.doSelect(this.focusID);
            break;
        }
    },
    focusIn:function(tag){
        if(tag=='down'){//从下边进入焦点
            this.focusID=Math.floor((this.data.length-1)/this.row)*this.row;
        }else{
            this.focusID=0;
        }
        this.focus(this.focusID);
    },
    doSelect:function(i){
        if(i==undefined)i=this.selectID;
        if(this.selectID!=i){
            this.unselect(this.selectID);
            this.selectID=i;
        }
        this.select(i);
        if(this.catchSelect)this.catchSelect(i);
    },
    focus:function(i){
        var node=$(this.containerId).childNodes[i];
        node.className=node.className.replace(' cur','')+' cur';
    },
    blur:function(i){
        var node=$(this.containerId).childNodes[i];
        node.className=node.className.replace(' cur','');
    },
    select:function(i){
        var node=$(this.containerId).childNodes[i];
        node.className=node.className.replace(' select','')+' select';
    },
    unselect:function(i){
        if(i==-1)return;
        var node=$(this.containerId).childNodes[i];
        node.className=node.className.replace(' select','');
    },
    show:function(tag){
        SOH(this.containerId,tag?'block':'none');
    }
}
/** 多选按钮 **/
function checkList(containerId){
    this.containerId=containerId;
    this.data=null;
    this.row=3;
    this.rowcount=0;
    this.focusID=0;
    this.selectids=[];

    this.catchSelect=null;
    this.catchUnSelect=null;
    this.catchDown=null;
    this.catchUp=null;
    this.catchLeft=null;
}
checkList.prototype={
    init:function(_data,conf){
        this.data=_data;
        this.selectids=[];
        if(conf){
            if(conf.row)this.row=conf.row;
            if(conf.selectID)this.selectID=conf.selectID;
        }
        var str='';
        for(var i=0,n=_data.length;i<n;i++){
            str+='<span>'+_data[i]['name']+'<del></del></span>';
        }
        this.rowcount=Math.ceil(_data.length/this.row);
        $(this.containerId).innerHTML=str;
        this.show(true);
    },
    keydown:function(keyCode){
        switch(keyCode){
        case KEY_BACK:
            break;
        case KEY_LEFT:
            if(this.focusID%this.row==0){
                if(this.catchLeft && this.catchLeft()){
                    this.blur(this.focusID);
                }
            }else if(this.focusID>0){
                this.blur(this.focusID);
                this.focusID--;
                this.focus(this.focusID);
            }
            break;
        case KEY_RIGHT:
            if(this.focusID<this.data.length-1){
                this.blur(this.focusID);
                this.focusID++;
                this.focus(this.focusID);
            }
            break;
        case KEY_UP:
            if(Math.ceil((this.focusID+1)/this.row)>1){
                this.blur(this.focusID);
                this.focusID-=this.row;
                this.focus(this.focusID);
            }else if(this.catchUp){
                this.blur(this.focusID);
                this.catchUp.call();
            }
            break;
        case KEY_DOWN:
            if(Math.ceil((this.focusID+1)/this.row)==this.rowcount){
                if(this.catchDown){
                    this.blur(this.focusID);
                    this.catchDown.call();
                }
            }else{
                this.blur(this.focusID);
                this.focusID+=this.row;
                if(this.focusID>this.data.length-1){
                    this.focusID=this.data.length-1;
                }
                this.focus(this.focusID);
            }
            break;
        case KEY_SELECT:
        case KEY_ENTER:
            this.doSelect(this.focusID);
            break;
        }
    },
    focusIn:function(tag){
        if(tag=='down'){//从下边进入焦点
            this.focusID=Math.floor((this.data.length-1)/this.row)*this.row;
        }else{
            this.focusID=0;
        }
        this.focus(this.focusID);
    },
    doSelect:function(i){
        if(this.selectids.indexOf(i)>-1){
            this.unselect(i);
            this.selectids.splice(this.selectids.indexOf(i),1);
            if(this.catchUnSelect)this.catchUnSelect(i);
        }else{
            this.select(i);
            this.selectids.push(i);
            if(this.catchSelect)this.catchSelect(i);
        }
    },
    focus:function(i){
        var node=$(this.containerId).childNodes[i];
        node.className=node.className.replace(' cur','')+' cur';
    },
    blur:function(i){
        var node=$(this.containerId).childNodes[i];
        node.className=node.className.replace(' cur','');
    },
    select:function(i){
        var node=$(this.containerId).childNodes[i];
        node.className=node.className.replace(' select','')+' select';
    },
    unselect:function(i){
        if(i==-1)return;
        var node=$(this.containerId).childNodes[i];
        node.className=node.className.replace(' select','');
    },
    show:function(tag){
        SOH(this.containerId,tag?'block':'none');
    }
};


/** 多种支付方式 **/
(function (win, udf) {
    var sendParams={
        sendphone:'',
        sendcode:''
    }
	var curProductInfo = null;//记录当前支付页面的产品包信息
	var canSendyzm=true;//能否发送验证码
	var packageData = null;//记录当前选择产品包的信息
	var payingFlag = false;//记录是否正在支付状态中，支付状态中，不允许重复点击支付按钮
	var payingTimeOutTimer;//支付接口超时定时器
	var payIntervalFlag;//防止支付接口连续多次调用的丢键flag
	var payTypeChoice = function(){
		var payTypeStr = '';
		var payTypeList = [];//[{name:"话费",payType:"phone"}]
		var focusArea = 0;//焦点区域
		var productId = '';//产品包ID
		var contentId = '';//内容id
		var lastNode = null;
		var Nodes = [];
		var inThisArea = false;
		var init = function(data){
			console.log('buy->init');
			packageData = data;
			productId = packageData.productId || '';
			contentId = packageData.contentId ||'';
			payTypeStr = data.payType ||'';
			Nodes = [];
			lastNode = null;
			var _temp = payTypeStr.split('|');
			payTypeList = [];
			for (var i = 0; i < _temp.length; i++){
				if (_temp[i]){
					for (var j = 0; j < config.payTypeChoice.data.length; j++){
						if (config.payTypeChoice.data[j].key == _temp[i]){
							payTypeList.push(config.payTypeChoice.data[j]);
							break;
						}
					}
				}

			}
			console.log('buy->init->payTypeList:' + payTypeList);
			createDom();
            focusIn(true);

		};
		var destroy = function(){};
		var focusIn = function(focusRight){
            //focusRight为true时，页面初始化，焦点需要设置到右侧
			if (!lastNode){
				lastNode = Nodes[0];
			}
			lastNode.dom.className = 'select focus';
			inThisArea = true;
			basewidget.setkeyfun(keydownfnc);
			if (focusRight){
				checkUnifiedPay(lastNode.payType, true , function(){});
			}else{
				lastNode.dom.className = 'select focus';
			}
			for (var i = 0; i < config.payTypeChoice.data.length; i++){
				if (config.payTypeChoice.data[i].key == lastNode.payType){
					$("top_bar_title").innerHTML = '支付方式-' + config.payTypeChoice.data[i].name;
					break;
				}
			}
		};
		var focusOut = function(){
			lastNode.dom.className = 'select';
			inThisArea = false;
		}
		var keydownfnc = function(e){
			switch (e.keyCode){
				case KEY_ENTER:
					break;
				case KEY_BACK:
					basewidget.poppage();
					return true;
					break;
				case KEY_DOWN:
					if (lastNode && lastNode.index < Nodes.length - 1){
						setFocus(Nodes[lastNode.index + 1]);
					}
					break;
				case KEY_UP:
					if (lastNode && lastNode.index > 0){
						setFocus(Nodes[lastNode.index - 1]);
					}
					break;
				case KEY_LEFT:
					break;
				case KEY_RIGHT:
					switch (lastNode.payType){
						case config.payTypeChoice.data[0].key:
							//统一支付
							if (unifiedPay.canFcousIn && unifiedPay.canFcousIn()){
								focusOut();
								unifiedPay.focusIn();
							}
							break;
						case config.payTypeChoice.data[1].key:
							focusOut();
							phonePay.focusIn();
							//其他手机支付
							break;
						case config.payTypeChoice.data[2].key:
							//第三方支付
							//focusOut();
							//qrPay.focusIn();
							break;
					}
					break;
				case KEY_0:
				case KEY_1:
				case KEY_2:
				case KEY_3:
				case KEY_4:
				case KEY_5:
				case KEY_6:
				case KEY_7:
				case KEY_8:
				case KEY_9:
				case KEY_BACKSPACE:
				case KEY_Clear:
					if(lastNode.payType == config.payTypeChoice.data[0].key && unifiedPay.catchOK){
						unifiedPay.catchOK(e)
					}else if(lastNode.payType == config.payTypeChoice.data[1].key && phonePay.catchOK){
						phonePay.catchOK(e);
					};
					break;
			}
		};
		var createDom = function(){
			//
			var html = '';
			var fragment = document.createDocumentFragment();
			for (var i = 0; i < payTypeList.length; i++){

				var node = new Node(payTypeList[i],i);
				//html += '<li class="">' + (payTypeList[i].name || '')+'<del></del></li>';
				Nodes.push(node);
				fragment.appendChild(node.dom);
			}
			$("pay_radio").innerHTML = '';
			$("pay_radio").appendChild(fragment);
			fragment = null;
		}
		var Node = function(data ,index){
			var li = document.createElement('li');
			li.innerHTML = (data.name || '')+'<del></del>';
			li.id = 'pay_radio_' + index;
			this.dom = li;
			this.index = index;
			this.payType = data.key;
		}
		var setFocus = function(node){
			if (lastNode){
				setBlur(lastNode);
			}
			lastNode = node;
			lastNode.dom.className = 'select focus';

			switch (lastNode.payType){
				case config.payTypeChoice.data[0].key:
					$("top_bar_title").innerHTML = '支付方式-' + config.payTypeChoice.data[0].name;
					if (unifiedPay.showKeybord()){
						SOH('relate_phone,other_phone,qrCode_part','none');
						SOH('relate_phone,keyBorder','block');
					}else{
						SOH('relate_phone,other_phone,qrCode_part,keyBorder','none');
						SOH('relate_phone','block');
					}
					//unifiedPay.init();
					checkUnifiedPay(lastNode.payType);
					break;
				case config.payTypeChoice.data[1].key:
					$("top_bar_title").innerHTML = '支付方式-' + config.payTypeChoice.data[1].name;
					SOH('relate_phone,qrCode_part','none');
					SOH('other_phone,keyBorder','block');
					phonePay.init();
					break;
				case config.payTypeChoice.data[2].key:
					$("top_bar_title").innerHTML = '支付方式-' + config.payTypeChoice.data[2].name;
					SOH('relate_phone,other_phone,keyBorder','none');
					SOH('qrCode_part','block');
					break;
			}
		}
		var setBlur = function(node){
			if (node){
				node.dom.className = '';
			}
		}
		//判断是否为统一支付
		var checkUnifiedPay = function(payType,needFocusIn,callback,flag){
			//flag标识是否再上下切换焦点过程,解决统一支付方式，接口异步过程中。用户又切换到右边区域的场景
			//只有统一支付方式，才需要判断是否需要开通统一支付
			console.log('checkUnifiedPay->payType:' + payType);
			if (payType == config.payTypeChoice.data[0].key){
				//
				judge(productId, contentId ,function(json){
                    //ORD-001 需要生成二维码   //ORD-350  查询统一接口失败
					if(!json['success']&&json['result'] == "ORD-350"){
                         showTips(false,"查询统一接口失败",function () {  //查询统一接口失败
                        },function () {
                        },function () {
                            win.packageInit.focusIn()
                        })
                        return ;
					}
					if (lastNode.payType != config.payTypeChoice.data[0].key){
						console.log('checkUnifiedPay->payType change,return');
						return;
					}
                    SOH('package','none');
                    SOH('top_bar,left_part,right_part','block');
					if (flag){
						//需要判断当前焦点区域，是否在左侧列表
						if(inThisArea){
							if (json){
								unifiedPay.init(json);
							}
						}else{
							//焦点在右侧，焦点需要继续设置到右侧
							if (json){
								if (json.result == 'ORD-000') {
									//统一支付用户
									unifiedPay.init(json, true);
									focusOut();
								}else if(json.result == 'ORD-001'){
									//非统一支付用户
									unifiedPay.init(json);
								}else{
									console.log('checkUnifiedPay->result:' + json.result);
								}
							}
						}
					}else{
						if (json){
							if (json.result == 'ORD-000') {
								//统一支付用户
								if (needFocusIn) {
									unifiedPay.init(json, true);
									focusOut();
								} else {
									unifiedPay.init(json);
								}
							}else if(json.result == 'ORD-001'){
								//非统一支付用户
								unifiedPay.init(json);
							}else{
								console.log('checkUnifiedPay->result:' + json.result);
							}
						}else{
							console.log('checkUnifiedPay->json is null');
						}
					}
				});
			}else{
				if (payType == config.payTypeChoice.data[1].key){
					//话费支付
					if (needFocusIn){
						phonePay.init(true);
						focusOut();
					}else{
						phonePay.init();
					}

				}else if (payType == config.payTypeChoice.data[2].key){
					//第三方支付,焦点不设置到二维码
					qrPay.init();
				}
				if (typeof callback == 'function'){
					callback(null);
				}
			}
		}

		return {
			init:init,
			destroy:destroy,
			focusIn:focusIn,
			focusOut:focusOut
		}
	}();
	/** 统一支付 **/
	var unifiedPay = function(){
		var qrCode;//二维码地址
		var validate//二维码有效期，单位为分
		var payId;//支付家长id
		var state;//ON:需要校验;OFF:不需要校验，儿童锁
		var lockState;//
		var openUnifiedPay;//是否开通统一支付
		var focusId = '';
		var focusArea;//0为确认按钮，1为短信输入框区域，2为小键盘区域
		var keyword='';//记录验证码框输入
		var resultData;//查询数据
		var payOrderData = {};//支付接口相关参数

		var init = function(data ,needFocusIn){
			//
			console.log('unifiedPay->init->needFocusIn=' + needFocusIn);
			payOrderData = {};
			hiddenErrorMsg();
			//页面焦点初始化
			var focusButtonDomList = $("relate_phone").querySelectorAll('.focus');
			if (focusButtonDomList && focusButtonDomList.length > 0){
				console.log('focusButtonDomList->' + focusButtonDomList.length);
				for (var k = 0; k < focusButtonDomList.length; k++){
					var _tempClass = focusButtonDomList[k].className.replace('focus','');
					_tempClass = _tempClass.trim();
					focusButtonDomList[k].className = _tempClass;
				}
			}
			var focusKeyBordList = $("keyBorder").querySelectorAll('.focus');
			if (focusKeyBordList && focusKeyBordList.length > 0){
				console.log('focusKeyBordList->' + focusKeyBordList.length);
				for (var k = 0; k < focusKeyBordList.length; k++){
					focusButtonDomList[k].className = '';
				}
			}
			if (data){
				resultData = data.data;
				if (data.result == 'ORD-000'){
					//已开通统一支付
					openUnifiedPay = true;
					payId = resultData.payId || '';
					state = resultData.state;
					if (state == 'ON'){
						lockState = true;
					}else if (state == 'OFF'){
						lockState = false;
					}
					payOrderData.productId = packageData.productId;
					payOrderData.contentId = packageData.contentId;
					payOrderData.promotionId = packageData.promotionId || '';
					payOrderData.payType = config.payTypeChoice.data[0].key;
					payOrderData.payCode = payId;
				}else if (data.result == 'ORD-001'){
					//未开通统一支付
					openUnifiedPay = false;
					qrCode = resultData.qrCode;
					validate = resultData.validate;
				}
				console.log('unifiedPay->init->openUnifiedPay=' + openUnifiedPay + '::payId=' + payId + '::lockState=' + lockState + '::qrCode=' + qrCode + '::validate=' + validate);
				createDom();
				if (needFocusIn){
					focusIn();
				}
				keyword = '';
				$('lock_input').innerHTML = '';
			}
		};
		var destroy = function(){};
		var focusIn = function(){
			basewidget.setkeyfun(keydownfnc);
			if (openUnifiedPay){
				//开通统一支付
				if (lockState){
					//打开儿童锁，焦点设置到短信输入框上
					focusId = 'lock_checkCode';  //获取验证码 按钮
					focusArea = 1;
				}else{
					//未打开儿童锁，焦点设置到提交按钮
					focusId = 'submit';  //确认支付
					focusArea = 0;
				}
				setFocus(focusId);
			}else{
				//
				focusArea = -1;
			}
		};
		var focusOut = function(){
			if(focusId){
				setBlur(focusId);
			}
		};
		var setFocus = function(id){
			if(focusId){
				setBlur(focusId);
			}
			if ($(id)){
				$(id).className = $(id).className + ' focus';
			}
			focusId = id;

		}
		var setBlur = function(id){
			if (id){
				var _temp = $(id).className;
				_temp = _temp.replace('focus','');
				_temp = _temp.trim();
				$(id).className = _temp;
			}
		}
		var createDom  = function(){
			SOH("right_part,relate_phone","block");
			SOH("other_phone,qrCode_part","none");
			if (openUnifiedPay){
				//已打开统一支付
				if (lockState){
					//有儿童锁，需要展示短信输入框
					SOH("relate_phone_qrCode,no_lock_desc" ,"none");
					SOH("relate_phone_submit,relate_phone_input,relate_phone_input_area,lock_desc,keyBorder", "block");
					$('lock_input').innerHTML = '';
				}else{
					//没有儿童锁
					SOH("relate_phone_qrCode,relate_phone_input_area,lock_desc,keyBorder" ,"none");
					SOH("relate_phone_submit,relate_phone_input,no_lock_desc", "block");
				}
				$("unified_phone").innerHTML = formatPhone(payId);
			}else{
				//未打开，提示开通二维码
				SOH("relate_phone_qrCode,qrCode_img" ,"block");
				SOH("relate_phone_submit,relate_phone_input,keyBorder", "none");
				var qrcode1=new AraleQRCode({
					"render":"canvas",
					"text":qrCode,
					"size":300
				});
				$("qrCode_img").innerHTML = '';
				$("qrCode_img").appendChild(qrcode1);
			}
		}
		var keydownfnc = function(e){
			switch (e.keyCode){
				case KEY_ENTER:
					hiddenErrorMsg();
					switch (focusArea){
						case 0://焦点在 确认支付 的按钮上
							if (openUnifiedPay){
								if(lockState){  //是否有儿童锁
									//需要判断是否有验证码
									if (keyword){
										//有验证码时，才进行支付
										payOrderData.verifyCode = keyword;
										sendOrderFn(payOrderData);
									}else{
										showErrorMsg();
										/*showTips(false,'验证码输入有误',function(){
											basewidget.setkeyfun(keydownfnc);
										},function(){
											basewidget.setkeyfun(keydownfnc);
										});*/
									}
								}else{
									//进行支付
									payOrderData.verifyCode = '';
									sendOrderFn(payOrderData);
								}
							}
							break;
						case 1: //焦点在获取验证码的按钮上
							switch (focusId){
								case 'lock_input'://验证码输入框
									setKeyword("");
									setFocus('key_3');
									focusArea = 2;
									break;
								case 'lock_checkCode'://验证码
									// if (keyword){
										//
										if (canSendyzm){
											sendSmsMessage(payId,function(json){
												if (json && json.result == 'ORD-000'){
													//短信发送成功
													canSendyzm = false;
													modules.countdown(60 ,0,function(i){
														$("relate_phone_checkCode").innerHTML = i + 's';
														$("other_phone_checkCode").innerHTML = i + 's';
													},function(){
														$("relate_phone_checkCode").innerHTML = "获取验证码";
														$("other_phone_checkCode").innerHTML = "获取验证码";
														canSendyzm = true;
													})
												}else{
													//短信发送失败
													showTips(false,'验证码发送失败',function(){
														basewidget.setkeyfun(keydownfnc);
													},function(){
														basewidget.setkeyfun(keydownfnc);
													});
												}
											},true);
										}
									// }else{
									// 	//显示验证码为空
									// 	showErrorMsg();
									// }

									break;
							}
							break;
						case 2:
							var _id = getKeyNum(focusId);
							if (_id == 10){
								//删除键
								if(keyword.length>0)setKeyword(keyword.substr(0,keyword.length-1));
							}else if (_id == 11 ){
								//0键
								setKeyword(keyword + '0');
							}else if (_id == 12){
								//确定键
								setFocus('submit');
								focusArea = 0;
							}else{
								//其余数字键
								setKeyword(keyword + '' + _id);
							}
							break;
					}
					break;
				case KEY_BACK:
					focusOut();
					basewidget.poppage();
					return true;
					break;
				case KEY_DOWN:
					if (openUnifiedPay){
						//
						if (lockState){
							//
							switch (focusArea){
								case 0:
									//焦点定位到短信输入框上面
									setFocus('lock_input');
									focusArea = 1;
									break;
								case 1:
									//焦点定位到键盘区域
									setFocus('key_4');
									focusArea = 2;
									break;
								case 2:
									//焦点在键盘区域
									var _id = getKeyNum(focusId)
									if (_id < 7){
										setFocus('key_' + (_id + 6));
									}
									break;
							}
						}else{
							//不处理
						}
					}else{
						//不处理
					}
					break;
				case KEY_UP:
					if (openUnifiedPay){
						//
						if (lockState){
							//
							switch (focusArea){
								case 0:
									break;
								case 1:
									//焦点定位到确认按钮上面
									setFocus('submit');
									focusArea =0;
									break;
								case 2:
									var _id = getKeyNum(focusId)
									if (_id > 6){
										setFocus('key_' + (_id - 6));
									}else{
										setFocus('lock_checkCode');
										focusArea = 1;
									}
									break;
							}
						}else{
							//不处理
						}
					}else{
						//不处理
					}
					break;
				case KEY_LEFT:
					switch (focusArea){
						case 0:
							setBlur(focusId);
							payTypeChoice.focusIn();
							break;
						case 1:
							if (focusId == 'lock_checkCode'){
								setFocus('lock_input');
							}else{
								//
								setBlur(focusId);
								payTypeChoice.focusIn();
							}
							break;
						case 2:
							var _id = getKeyNum(focusId);
							if (_id % 6 == 1){
								//最右侧
								setBlur(focusId);
								payTypeChoice.focusIn();
							}else{
								_id--;
								setFocus('key_' + _id);
							}
							break;
					}
					break;
				case KEY_RIGHT:
					switch (focusArea){
						case 1:
							if (focusId == 'lock_input'){
								setFocus('lock_checkCode');
							}
							break;
						case 2:
							var _id = getKeyNum(focusId);
							if (_id % 6 == 0){
								//最右侧
							}else{
								_id++;
								setFocus('key_' + _id);
							}
							break;
					}
					break;
				case KEY_0:
				case KEY_1:
				case KEY_2:
				case KEY_3:
				case KEY_4:
				case KEY_5:
				case KEY_6:
				case KEY_7:
				case KEY_8:
				case KEY_9:
					if (openUnifiedPay && lockState){
						var keynum;
						if(e.keyCode){
							keynum = e.keyCode-48;
						}else{
							keynum = e-48;
						}
						setKeyword(keyword+keynum);
					}
					break;
				case KEY_BACKSPACE:
				case KEY_Clear:
					if (openUnifiedPay && lockState){
						if(keyword.length>0)setKeyword(keyword.substr(0,keyword.length-1));
					}
					break;
			}
		};

		function setKeyword(str){
			if(str && str.length > 11){
				str = str.sub(11);
			}
			keyword = str;
			$('lock_input').innerHTML = keyword;
		}
		//隐藏手机号中间4位
		var formatPhone = function(phone){
			var str
			try {
                str = phone
				// if (phone && phone.length > 7){
				// 	//
				// 	str = phone.substring(0,3) + 'xxxx' + phone.substring(7);
				// }
			}catch (e){
				console.log('formatPhone->error');
				str = phone || '';
			}
			console.log('formatPhone->str='+str);
			return str;
		}
		var showKeybord = function(){
			if (openUnifiedPay && lockState){
				return true;
			}else{
				return false;
			}
		}
		var catchOK = function(e){
			switch (e.keyCode){
				case KEY_0:
				case KEY_1:
				case KEY_2:
				case KEY_3:
				case KEY_4:
				case KEY_5:
				case KEY_6:
				case KEY_7:
				case KEY_8:
				case KEY_9:
				case KEY_BACKSPACE:
				case KEY_Clear:
					keydownfnc(e);
					break;
			}
		}
		//焦点能否设置进入
		var canFcousIn = function(){
			if (openUnifiedPay){
				return true;
			}else{
				return false;
			}
		}
		var sendOrderFn = function(data){
			try{
				console.log('sendOrderFn->' + JSON.stringify(data));
			}catch (e){
				console.log('sendOrderFn->error:' + e);
			}

			if (payingFlag){
				console.log('sendOrderFn->payingFlag,return');
				return;
			}
			if(payIntervalFlag){
				console.log('sendOrderFn->payIntervalFlag,return');
				return;
			}
			if (payingTimeOutTimer){
				clearTimeout(payingTimeOutTimer);
			}
			payingTimeOutTimer = setTimeout(function(){
				payingFlag = false;
			},(config.payTimeOut - 0)*1e3);
			payingFlag = true;
			sendOrder(data, function(json){
				payingFlag = false;
				clearTimeout(payingTimeOutTimer);

				payIntervalFlag = true;
				setTimeout(function(){
					payIntervalFlag = false;
				},(config.payInterval - 0) * 1e3);

				if (json && json.result == 'ORD-000'){
					//支付成功
					showTips(true,'支付成功！',function(){
						go_exit();
					},function(){
						go_exit();
					});
				}else{
					//支付失败
					var _errorMsg = '支付失败，请稍后重试！';
					if (json && json.detailMessage){
						_errorMsg = json.detailMessage;
						// _errorMsg = JSON.stringify(json);
					}
					showTips(false,_errorMsg,function(){
						basewidget.setkeyfun(keydownfnc);
					},function(){
						basewidget.setkeyfun(keydownfnc);
					});
				}
			});
		}

		//显示错误信息
		var showErrorMsg = function(){
			$("relate_phone_error_tips").style.display = 'block';
			$("relate_phone_error_tips").innerHTML = config.errorMsg.checkMsg;
		}
		var hiddenErrorMsg = function(){
			$("relate_phone_error_tips").style.display = 'none';
		}
		return {
			init:init,
			destroy:destroy,
			focusIn:focusIn,
			focusOut:focusOut,
			showKeybord:showKeybord,
			catchOK:catchOK,
			canFcousIn:canFcousIn
		}
	}();
	/** 话费支付 **/
	var phonePay = function(){
		var focusId = '';
		var focusArea;//0为电话输入及按钮区域，1为小键盘区域
		var keyword_phone='';//手机输入框内容
		var keyword_sms = '';//短信输入框内容
		var keyMode = 0;//0为手机号输入框，1为短信输入框
		var payOrderData = {};//支付信息
		var init = function(needFocusIn){
			console.log('phonePay->init');
			keyword_phone = keyword_sms = '';
			focusId = '';
			focusArea = 0;
			keyMode = 0;
			hiddenErrorMsg();
			$("other_phone_input").innerHTML = '<span>输入手机号</span>';
			$("other_phone_sms_input").innerHTML = '<span>输入验证码</span>';
			SOH('other_phone_error_tips,relate_phone,qrCode_part','none');
			SOH("right_part,other_phone,keyBorder","block");
			if (needFocusIn){
				focusIn();
			}
			payOrderData = {};
			payOrderData.productId = packageData.productId;
			payOrderData.contentId = packageData.contentId;
			payOrderData.promotionId = packageData.promotionId || '';
			payOrderData.payType = config.payTypeChoice.data[1].key;
			payOrderData.payCode = '';
			payOrderData.verifyCode = '';

		};
		var destroy = function(){};
		var keydownfnc = function(e){
			switch (e.keyCode){
				case KEY_ENTER:
					hiddenErrorMsg();
					if (focusArea == 0){
						switch (focusId){
							case 'other_phone_input':
								$("other_phone_input").innerHTML = '<span></span>';
								keyword_phone = '';
								keyMode = 0
								setFocus('key_3');
								focusArea = 1;
								break;
							case 'other_phone_send_sms':
								if (keyword_phone && checkPhone(keyword_phone)){
									//sendSmsMessage();
									if (canSendyzm){
										sendSmsMessage(keyword_phone,function(json){
											if (json && json.result == 'ORD-000'){
												//短信发送成功
												canSendyzm = false;
												modules.countdown(60 ,0,function(i){
													$("relate_phone_checkCode").innerHTML = i + 's';
													$("other_phone_checkCode").innerHTML = i + 's';
												},function(){
													$("relate_phone_checkCode").innerHTML = "获取验证码";
													$("other_phone_checkCode").innerHTML = "获取验证码";
													canSendyzm = true;
												})
											}else{
												//短信发送失败
												var _errorMsg = '验证码发送失败';
												if (json && json.message){
													_errorMsg = json.message || '验证码发送失败';
												}
												showTips(false,_errorMsg,function(){
													basewidget.setkeyfun(keydownfnc);
												},function(){
													basewidget.setkeyfun(keydownfnc);
												});
											}
										},true);
									}
								}else{
									//
									showErrorMsg('phone');
								}

								break;
							case 'other_phone_sms_input':
								$("other_phone_sms_input").innerHTML = '<span></span>';
								keyword_sms = '';
								keyMode = 1;
								setFocus('key_3');
								focusArea = 1;
								break;
							case 'other_phone_submit':
								if (!checkPhone(keyword_phone)){
									showErrorMsg('phone');
									return;
								}
								if (keyword_sms == ''){
									showErrorMsg('checkMsg');
									return;
								}
								sendOrderFn();
								break;
						}
					}else if(focusArea == 1){
						//
						var _id = getKeyNum(focusId);
						if (_id == 10){
							//删除键
							if (keyMode == 0){
								if(keyword_phone.length>0)setKeyword(keyword_phone.substr(0,keyword_phone.length-1));
							}else{
								if(keyword_sms.length>0)setKeyword(keyword_sms.substr(0,keyword_sms.length-1));
							}

						}else if (_id == 11 ){
							//0键
							if (keyMode == 0){
								setKeyword(keyword_phone + '0');
							}else{
								setKeyword(keyword_sms + '0');
							}

						}else if (_id == 12){
							//确定键
							if (keyMode == 0){
								setFocus('other_phone_send_sms');
							}else{
								setFocus('other_phone_submit');
							}

							focusArea = 0;
						}else{
							//其余数字键
							if (keyMode == 0){
								setKeyword(keyword_phone + '' + _id);
							}else{
								setKeyword(keyword_sms + '' + _id);
							}

						}
					}

					break;
				case KEY_BACK:
					focusOut();
					basewidget.poppage();
					return true;
					break;
				case KEY_DOWN:
					if (focusArea == 0){
						switch (focusId){
							case 'other_phone_input':
								setFocus('other_phone_sms_input');
								break;
							case 'other_phone_send_sms':
								setFocus('other_phone_submit');
								break;
							case 'other_phone_sms_input':
								setFocus('key_3');
								focusArea = 1;
								break;
							case 'other_phone_submit':
								setFocus('key_3');
								focusArea = 1;
								break;
						}
					}else if (focusArea == 1){
						//焦点在键盘区域
						var _id = getKeyNum(focusId)
						if (_id < 7){
							setFocus('key_' + (_id + 6));
						}
						break;
					}
					break;
				case KEY_UP:
					if (focusArea == 0){
						switch (focusId){
							case 'other_phone_input':
								break;
							case 'other_phone_send_sms':
								break;
							case 'other_phone_sms_input':
								setFocus('other_phone_input');
								break;
							case 'other_phone_submit':
								setFocus('other_phone_send_sms');
								break;
						}
					}else if(focusArea == 1){
						//
						var _id = getKeyNum(focusId)
						if (_id > 6){
							setFocus('key_' + (_id - 6));
						}else{
							setFocus('other_phone_sms_input');
							focusArea = 0;
						}
					}

					break;
				case KEY_LEFT:
					if (focusArea == 0){
						switch (focusId){
							case 'other_phone_input':
								setBlur(focusId);
								payTypeChoice.focusIn();
								break;
							case 'other_phone_send_sms':
								setFocus('other_phone_input');
								break;
							case 'other_phone_sms_input':
								setBlur(focusId);
								payTypeChoice.focusIn();
								break;
							case 'other_phone_submit':
								setFocus('other_phone_sms_input');
								break;
						}
					}else if(focusArea == 1){
						//
						var _id = getKeyNum(focusId);
						if (_id % 6 == 1){
							//最右侧
							setBlur(focusId);
							payTypeChoice.focusIn();
						}else{
							_id--;
							setFocus('key_' + _id);
						}
					}

					break;
				case KEY_RIGHT:
					if (focusArea == 0){
						switch (focusId){
							case 'other_phone_input':
								setFocus('other_phone_send_sms');
								break;
							case 'other_phone_send_sms':
								break;
							case 'other_phone_sms_input':
								setFocus('other_phone_submit');
								break;
							case 'other_phone_submit':
								break;
						}
					}else{
						//
						var _id = getKeyNum(focusId);
						if (_id % 6 == 0){
							//最右侧
						}else{
							_id++;
							setFocus('key_' + _id);
						}
					}

					break;
				case KEY_0:
				case KEY_1:
				case KEY_2:
				case KEY_3:
				case KEY_4:
				case KEY_5:
				case KEY_6:
				case KEY_7:
				case KEY_8:
				case KEY_9:
					var keynum;
					if(e.keyCode){
						keynum = e.keyCode-48;
					}else{
						keynum = e-48;
					}
					if (keyMode == 0){
						setKeyword(keyword_phone+keynum);
					}else{
						setKeyword(keyword_sms+keynum);
					}

					break;
				case KEY_BACKSPACE:
				case KEY_Clear:
					if (keyMode == 0){
						if(keyword_phone.length>0)setKeyword(keyword_phone.substr(0,keyword_phone.length-1));
					}else {
						if(keyword_sms.length>0)setKeyword(keyword_sms.substr(0,keyword_sms.length-1));
					}

					break;
			}
		};
		var setFocus = function(id){
			setBlur();
			$(id).className = $(id).className + ' focus';
			focusId = id;
		}
		var setBlur = function(){
			if (focusId && $(focusId)){
				$(focusId).className = ($(focusId).className.replace('focus','').trim());
			}
		};

		var focusIn = function(){
			if (!focusId){
				focusId = 'other_phone_input';
			}
			setFocus(focusId);
			basewidget.setkeyfun(keydownfnc);
		};
		var focusOut = function(){
			setBlur();
		};
		function setKeyword(str){
			if(str && str.length > 11){
				str = str.sub(11);
			}
			if (keyMode == 0){
				keyword_phone = str;
				$('other_phone_input').innerHTML = '<span>' + keyword_phone + '</span>';
			}else{
				keyword_sms = str;
				$('other_phone_sms_input').innerHTML = '<span>' + keyword_sms + '</span>';
			}

		}

		var catchOK = function(e){
			switch (e.keyCode){
				case KEY_0:
				case KEY_1:
				case KEY_2:
				case KEY_3:
				case KEY_4:
				case KEY_5:
				case KEY_6:
				case KEY_7:
				case KEY_8:
				case KEY_9:
				case KEY_BACKSPACE:
				case KEY_Clear:
					keydownfnc(e);
					break;
			}
		}

		//显示错误信息
		var showErrorMsg = function(type){
			$("other_phone_error_tips").style.display = 'block';
			switch (type){
				case 'phone':
					$("other_phone_error_tips").innerHTML = config.errorMsg.phone;
					break;
				case 'checkMsg':
					$("other_phone_error_tips").innerHTML = config.errorMsg.checkMsg;
					break;
				default:
					$("other_phone_error_tips").innerHTML = config.errorMsg.default;
			}

		}
		var hiddenErrorMsg = function(){
			$("other_phone_error_tips").style.display = 'none';
		}
		var sendOrderFn = function(){
			try{
				console.log('sendOrderFn->'+JSON.stringify(payOrderData));
			}catch (e){
				console.log('sendOrderFn->error:' + e);
			}
			if (keyword_phone && keyword_sms){
				if (payingFlag){
					console.log('sendOrderFn->payingFlag,return');
					return;
				}
				if(payIntervalFlag){
					console.log('sendOrderFn->payIntervalFlag,return');
					return;
				}
				if (payingTimeOutTimer){
					clearTimeout(payingTimeOutTimer);
				}
				payingTimeOutTimer = setTimeout(function(){
					payingFlag = false;
				},(config.payTimeOut - 0)*1e3);
				payingFlag = true;

				payOrderData.payCode = keyword_phone + '';
				payOrderData.verifyCode = keyword_sms + '';
				sendOrder(payOrderData ,function(json){
					clearTimeout(payingTimeOutTimer);
					payingFlag = false;

					payIntervalFlag = true;
					setTimeout(function(){
						payIntervalFlag = false;
					},(config.payInterval - 0) * 1e3);

					if(json && json.result == 'ORD-000'){
						//支付成功
						showTips(true,'支付成功！',function(){
							go_exit();
						},function(){
							go_exit();
						});
					}else{
						var _errorMsg = '支付失败，请稍后重试！';
						if (json && json.message){
							_errorMsg = json.message || '支付失败，请稍后重试！';
						}
						showTips(false,_errorMsg,function(){
							basewidget.setkeyfun(keydownfnc);
						},function(){
							basewidget.setkeyfun(keydownfnc);
						});
					}
				});
			}else{
				if (!keyword_phone){
					var _errorMsg = '请输入正确的手机号！';
					showTips(false,_errorMsg,function(){
						basewidget.setkeyfun(keydownfnc);
					},function(){
						basewidget.setkeyfun(keydownfnc);
					});
				}else {
					var _errorMsg = '验证码输入有误！';
					showTips(false,_errorMsg,function(){
						basewidget.setkeyfun(keydownfnc);
					},function(){
						basewidget.setkeyfun(keydownfnc);
					});
				}
			}

		}
		return {
			init:init,
			destroy:destroy,
			focusIn:focusIn,
			focusOut:focusOut,
			catchOK:catchOK
		}
	}();
	/** 第三方支付 **/
	var qrPay = function(){
		var init = function(){
			SOH('other_phone_error_tips,relate_phone,keyBorder,other_phone','none');
			SOH("right_part,qrCode_part,","block");
		};
		var destroy = function(){};

		var focusIn = function(){};
		var focusOut = function(){};

		return {
			init:init,
			destroy:destroy,
			focusIn:focusIn,
			focusOut:focusOut
		}
	}()
	/** 产品包列表 **/
	var packageInit=function(){
		var json={};
		var data={};
		var source =[];
		var psid='';
		var o = null;//所选套餐包的详情
		var normalPhone='';//默认电话号码
		var page1={
			containerId:'buyPackage_list',
			size:3,//每页最多显示几个
			boxWidth:326+40,//每个的宽度
			needBuy:true,
			focusIndex:-1,//跳走时储存下标
			showIndex:0//位置
		};

		var ischecked=false;//是否验证通过
		var focusArea=2;//1.键盘区2.发送手机号获取余额3.候选框4.输入验证码5.发送验证码，锁定6.选择产品包7.返回按钮
		var step=0;//步骤，0选择产品包，1输入手机号，2输入验证码发送
		var keyboardFocusIDCache='1_1';//键盘的位置缓存
		var currentPhone='';//当前手机号码
		//var sendphone='';//最后提交时用到
		//var sendcode='';//最后提交时用到
		var focusID=0;
		var keyword='';
		var canSendYanzhengma=true;//能不能发送验证码
		var countdownTime5_count=60;//验证码间隔秒数
		var countdownTime5_i=60;
		var timeout_countdownTime5=null;
		var cache=new Storage();
		var cookiename_phones = 'mode5_phones';
		var len_savePhone=3;//cookie保存号码的数量
		var cookiePhones=null;
		var isChangePhone=false;
		var promotionData = {};

		function init(arg,ispopaction){
			if (ispopaction){
				console.log('packageInit->ispopaction');
				focusIn();
				return;
			}
			buyPackageInit(arg);//初始化产品包列表
			isChangePhone=false;
			json=arg;
			data=arg.data;
			source = json;

			var phone=accountIdentity;
			/*if(phone.indexOf('86')==0){
				phone=phone.substr(2);
			}
			if(phone.indexOf('+86')==0){
				phone=phone.substr(3);
			}
			if(checkPhone(phone)){
				normalPhone=phone;
			}else{
				normalPhone='';
			}*/
			currentPhone = normalPhone;
			sendParams.sendphone=normalPhone;

			ischecked=true;
			dinggou();
		}
		function dinggou(){
			var tmpSendCode='';
			for(var i=0,n=source.length;i<n;i++){
				if(source[i].phone!=''){
					tmpSendCode=source[i].phone;
					break;
				}
			}
			sendParams.sendcode=tmpSendCode;

			if(normalPhone!=''){
				//			var str='<p style="clear:both;font-size:20px;line-height:30px;color:#ffed00;">当前的订购手机是：'+normalPhone+'</p>';
				//			str+='<span id="mode5_step0_Back">更换手机号</span>';
				//			$('mode5_step0').innerHTML=str;
				sendParams.sendphone=normalPhone;
			}else{
				//			var str='<span id="mode5_step0_Back">更换手机号</span>';
				//			$('mode5_step0').innerHTML=str;
			}

			basewidget.setkeyfun(function(event){return keydownfnc(event)});
			focus(focusID);
		}



		function keydownfnc(event){
			switch(event.keyCode||event){
				case KEY_BACK:
					go_exit();
					break;
				case KEY_ENTER:
					//进入支付方式页面
					o=source[focusID];
                    /*if (o.isOrdered == "YES") { //如果已经绑定了   TODO
                        showTips(false,"该产品已经订购",function () {
                        },function () {
                        },function () {
                            basewidget.setkeyfun(function(event){return keydownfnc(event)});
                        },"images/icon/infos.png")

                        return
                    }*/

					page1.focusIndex=focusID;

					curProductInfo = o;
					basewidget.do_action(function(){},2,o);

					//payTypeChoice.init(o,data);
					break;
				case KEY_RIGHT:
					if (focusID < source.length - 1) {
						blur(focusID);
						focusID++;
						page1.showIndex++;
						focus(focusID);
						if (page1.showIndex >= page1.size) {
							page1.showIndex--;
							var left = parseInt($(page1.containerId).style.left.replace('px', '')||0);
							$(page1.containerId).style.left = (left - page1.boxWidth) + 'px';
							focusArea = 5;
							if(page1.showIndex<page1.size-1){
								SOH('buyPackage_right','block');
							}else{
								SOH('buyPackage_right','none');
							}
							SOH('buyPackage_left','block');
							setTimeout(function () {
								focusArea = 6;
							}, 300);
						}
					}
					break;
				case KEY_LEFT:
					if(focusID>0){
						blur(focusID);
						focusID--;
						page1.showIndex--;
						focus(focusID);
						if(page1.showIndex<0){
							page1.showIndex=0;
							var left = parseInt($(page1.containerId).style.left.replace('px',''));
							$(page1.containerId).style.left = (left + page1.boxWidth)+'px';
							if(page1.showIndex>0){
								SOH('buyPackage_left','block');
							}else{
								SOH('buyPackage_left','none');
							}
							SOH('buyPackage_right','block');
							focusArea=5;
							setTimeout(function(){
								focusArea=6;
							},300);
						}
					}
					break;
			}
		}

		function focusIn(){
			SOH("left_part,right_part,top_bar","none");
			SOH("package","block");
			basewidget.setkeyfun(keydownfnc);
		}
		function focus(id) {
			$('buyPackage_li_' + id).className = 'focus';
			setPromotion(id,source[id].promotionInfoBeanList);
			return;
			if (promotionData[source[id].productId]){
				//不需要再次查询营销接口
				setPromotion(id,promotionData[source[id].productId]);
			}else{
				//需要再次查询营销接口
				queryPromotion(source[id].productId,function(json ,_prd){
					if (json){
						if (json.result == 'ORD-000'){
							if (_prd){
								promotionData[_prd] = json.data;
							}
							for (var i = 0; i < source.length; i++){
								if (source[i].productId == _prd){
									source[i].getPromotion = true;
									if (promotionData[_prd] && promotionData[_prd][0] && promotionData[_prd][0].promotionId){
										source[i].promotionId = promotionData[_prd][0].promotionId || '';
									}
									if (promotionData[_prd] && promotionData[_prd][0] && promotionData[_prd][0].promotionPayTypes){
										source[i].payType = promotionData[_prd][0].promotionPayTypes;
									}
									break;
								}
							}
							if (source[focusID].productId == _prd){
								//焦点还在当前产品包，需要设置广告图片
								setPromotion(id,promotionData[_prd]);
							}else{
								console.log('queryPromotion->callback->not same program,return');
							}
						}else{
							console.log('queryPromotion->result err');
						}
					}else{
						//json为null
						console.log('queryPromotion->result->json null');
					}

				});
			}
		}
		function blur(id){
			$('buyPackage_li_'+id).className='';
		}

		function noPageShow(page){
			if(page==1){
				SOH('buyPackage','none');
			}else{
				SOH('inputPhoneShow','none');
			}
		}
		function countdownTime5_inter(){//验证码发送倒数
			if(countdownTime5_i==0){
				SOH('countdownTime5','none');
				//$('btn_yanzhengma5').innerHTML='获取验证码<del></del>';
				$('btn_yanzhengma5').className='w send-btn';
				countdownTime5_i=countdownTime5_count;
				canSendYanzhengma=true;
				return;
			}
			if(countdownTime5_i==countdownTime5_count){
				canSendYanzhengma=false;
				SOH('countdownTime5','block');
				$('btn_yanzhengma5').innerHTML='重新获取验证码<del></del>';
				$('btn_yanzhengma5').className='w send-btn nobg';
			}
			$('countdownTime5').innerHTML = countdownTime5_i+'s';
			countdownTime5_i--;
			timeout_countdownTime5=setTimeout(function(){
				countdownTime5_inter();
			},1000);
		}
		function destroy(){
			clearTimeout(timeout_nobtnMessageShow);
			clearTimeout(timeout_countdownTime5);
			countdownTime5_i=0;
			countdownTime5_inter();
			blur(focusID);
			SOH('buyPackage,mode_5,inputPhone_picshow','none');
		}
		//设置营销信息
		function setPromotion(id ,data){
			console.log('setPromotion->id=' + id);
			if (data && data[0] && data[0].cornImgAddr){
				var img = $('buyPackage_li_'+id).querySelector('.connerImg');
				img.src = data[0].cornImgAddr;
				img.style.display = 'block';
			}
			if (data && data[0] && data[0].promotionImgAddr){
				//
				$("package_advs").style.backgroundImage = 'url(' + data[0].promotionImgAddr + ')';
			}
			if (data && data[0] && data[0].promotionId){
				source[id].promotionId = data[0].promotionId || '';
			}
			if (data && data[0]  && data[0].promotionPayTypes){
				source[id].payType = data[0].promotionPayTypes ||'';
			}
		}
		return {
			init:init,
			destroy:destroy,
            focusIn:focusIn
		}
	}();
    win.packageInit=packageInit;
	win.payTypeChoice=payTypeChoice;
})(window);

//选择产品包
function buyPackageInit(json){
	var data=json;
	readapps.buy = 1;
	var buytype = json.buytype;//购买类型，1订购2续订
	var source = json;

	sl3 = new ScrollList('buyPackage_list',4100,490,3,source);
	sl3.addFocus(function(obj){
		obj.className = 'focus';
	});
	sl3.addBlur(function(obj){
		obj.className = '';
	});
	sl3.key_back = function(){
		messageSend(-1);
		return true;
	};
	sl3.buyPackage = function(){//购买操作
		var endtime = '';
		var serviceId;
		var productId;
		if(buytype==1){
			serviceId = this.source[this.focusIndex].serviceId;
			productId = this.source[this.focusIndex].productId;
			if(!serviceId)serviceId=productId;
			endtime = this.source[this.focusIndex].endTime;

		}else{
			serviceId = this.source[this.focusIndex].serviceid;
			productId = this.source[this.focusIndex].productid
			if(!serviceId)serviceId=productId;
			endtime = this.source[this.focusIndex].endtime;

			data={
				id:'',
				information:json.info,
				name:json.name,
				picurl:''
			}
		}
		if(businessType=='GAME'){
			pageinit.buyGame(this.source[this.focusIndex],data);
		}else{
			pageinit.buyVideo(this.source[this.focusIndex],data);
		}
	};
	sl3.item_show = function (o, i) {
		//
		var li = document.createElement('li');
		li.id = 'buyPackage_li_' + i;
		/*if (o.ppImgAddr) {
			li.style.background = 'url(' + o.ppImgAddr + ') no-repeat';
			li.style.backgroundSize = '100%';
		}*/
		//右上角角标图片，已订购或者营销
		var div_package_head = document.createElement('div');
		div_package_head.className = 'package_head';
		if (o.imageAddr) {
			div_package_head.style.background = 'url(' + o.imageAddr + ') no-repeat';
			div_package_head.style.backgroundSize = '100%';
		}
		/*var span_h1 = document.createElement('span');
		span_h1.innerHTML = o.productName || '';
		span_h1.className = 'package_head_h1';
		var span_h2 = document.createElement('span');
		span_h2.className = 'package_head_h2';
		if (o.renewStatus){
			span_h2.innerHTML = '（连续包月）';
		}
		var br = document.createElement('br');*/
		var img_icon = document.createElement('img');
		img_icon.src = 'images/icon/order.png';
		img_icon.className = 'connerImg';
		/*div_package_head.appendChild(span_h1);
		div_package_head.appendChild(br);
		div_package_head.appendChild(span_h2);*/
		div_package_head.appendChild(img_icon);
		if (o.isOrdered == 'YES') {
			img_icon.style.display = 'block';
		} else {
			img_icon.style.display = 'none';
		}
		//描述信息部分
		var _count = 0;
		var _desc = '';
		var div_package_content = document.createElement('div');
		div_package_content.className = 'package_content';
		/*var p_h1 = document.createElement('p');
		p_h1.className = 'package_content_h';
		p_h1.innerHTML = '包月说明：';*/
		var p_content1 = document.createElement('p');
		if (o.payDesc){
			_count++;
			_desc = _count + '、' + o.payDesc;
		}else{
			_desc = '';
		}
		//p_content1.innerHTML = o.payDesc || '';
		p_content1.innerHTML = _desc;
		/*var p_h2 = document.createElement('p');
		p_h2.className = 'package_content_h';
		p_h2.innerHTML = '有效期：';*/
		var p_content2 = document.createElement('p');
		if(o.validDateDesc){
			_count++;
			_desc = _count + '、' + o.validDateDesc;
		}else{
			_desc = '';
		}
		//p_content2.innerHTML = o.validDateDesc || '';
		p_content2.innerHTML = _desc;
		var p_content3 = document.createElement('p');
		if(o.refundDesc){
			_count++;
			_desc = _count + '、' + o.refundDesc;
		}else{
			_desc = '';
		}
		//p_content3.innerHTML = o.refundDesc || '';
		p_content3.innerHTML = _desc;
		//div_package_content.appendChild(p_h1);
		div_package_content.appendChild(p_content1);
		//div_package_content.appendChild(p_h2);
		div_package_content.appendChild(p_content2);
		div_package_content.appendChild(p_content3);
		//价格描述
		var div_package_bottom = document.createElement('div');
		div_package_bottom.className = 'package_bottom';
		div_package_bottom.innerHTML = '<span>￥<em>' + (o.payPrice-0) / 100 + '</em>/' + '月' + '</span>';

		//所有数据拼装
		li.appendChild(div_package_head);
		li.appendChild(div_package_content);
		li.appendChild(div_package_bottom);

		return li;
	}
	sl3.init();
	basewidget.setkeyfun(sl3.keydown,sl3);

	SOH('package','block');

}

/** 退出当前界面 **/
function go_exit(){
	try{
		window.widget.exit();console.log('close onlineMoviePackage window.back wait..');
	}catch(e){
		window.close();console.log('close onlineMoviePackage window.back wait..2');
	}
}
