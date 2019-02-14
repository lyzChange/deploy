//data_ip = 'http://newpanel.cntv.bcs.ottcn.com:8080/tsop-topic/api/topic/';
var topicName =(GetQueryString("topicName"))?GetQueryString("topicName"):'';
var dataUrl = data_ip+'/getTopicData?topicName='+topicName;
if(GetQueryString("userID")){
	snsUserId=GetQueryString("userID");
}
function Primary(){
	this.data = [];
	this.index = 0;
	this.selectIndex = 0;
	this.openIndex = -1;
	this.subIndex = 0;
	this.selectSubIndex=0;
	this.enterSub = false;
	this.curPage = 1;
	this.pageNum = 10;	
	this.area = 0;
	this.picIndex = 0;
	this.curBig  = '';
	this.norBig = '';
	this.cursm = '';
	this.norsm = '';
	this.listPage = 1;
}
Primary.prototype = {
	constructor:Primary,
	init:function(data){
		var img = new Image();
		var that = this;
		img.onload = function(){
			$('Main').style.backgroundImage = 'url(' + data[0].bgImg + ')';
			show('ListBg');
			that.toDealData(data[0]);
		}
		img.src = data[0].bgImg;
		try {
			EPG_expose();
		}catch (e){
			console.log('EPG_expose->error:' + e);
		}
	},
	toDealData:function(data){
		if(data.focus && data.focus.length > 0){
			this.curBig = (data.focus[0])?'<img class="curpic" src="'+data.focus[0]+'">':'';
			this.norBig = (data.focus[1])?'<img class="pic" src="'+data.focus[1]+'">':'';
		}
		if(this.curBig == '' && this.norBig == ''){
			this.curBig = '<img class="curpic" src="template_13/images/li-curbg.png">';
			this.norBig = '<img class="pic" src="template_13/images/li-bgnor.png">';
		}
		for(var i = 0; i < data.class.length; i++){
			var _obj = {};
			_obj.class = data.class[i];
			_obj.course = [];
			this.data.push(_obj)
		}
		for(var i=0; i<data.list.length; i++){
			var _class = getArrIndex(data.list[i].class,data.class);
			if(typeof(_class) == 'number'){
				if(this.data[_class]){
					this.data[_class].course.push(data.list[i]);
				}
			}
		};
		this.toHtml();
	},
	toHtml:function(){
		var _html = '';
		for(var i=0; i<this.data.length; i++){
			_html += '<li class="li" id="li-'+i+'">'+this.curBig+this.norBig+'<p class="text">'+this.data[i].class+'</p>';
			_html += '</li>'
		}
		$('List').innerHTML = _html;
		var that = this;
		$('mainLi').addEventListener('webkitTransitionEnd', function(e) {
			if(e.propertyName == 'top'){
				$('mainLi').style.webkitTransition = 'none';
				$('mainLi').style.top = '-508px';
				Loading = false;
				that.toRightHtml();
				addClass('mainli-'+that.picIndex,'cur');
				that.nameScroll();
			}
		}, false);	
		$('List').addEventListener('webkitTransitionEnd', function(e) {
			if(e.propertyName == 'top'){
				Loading = false;
			}
		}, false);
			
		this.toRightHtml();
		this.focusIn();
	},
	toRightHtml:function(){
		hide('dataLoad');
		show('Title');
		$('Title').innerHTML = this.data[this.selectIndex].class;
		if(this.data[this.selectIndex].course.length == 0){
			hide('Page');
			$('mainLi').innerHTML = '<div class="nolist"><div>暂无相关信息！</div></div>';
			return;
		};
		this.totleNum = (this.data[this.selectIndex].course.length > 0)?this.data[this.selectIndex].course.length:0;
		this.totlePage = Math.ceil(this.totleNum / this.pageNum);
		$('curPageNum').innerHTML = this.curPage;
		$('totPageNum').innerHTML = this.totlePage;
		show('Page');
		var _data = this.data[this.selectIndex].course;
		if(this.curPage == 1){
			var _html = '<div class="one-page"></div>';
			var _num = (this.totleNum > this.pageNum * 2) ? this.pageNum * 2 : this.totleNum;
			for(var i = 0; i<_num; i++){
				_data[i].title = (_data[i].title)?_data[i].title:this.data[this.selectIndex].class;
				var nameStrArr = cutStr(_data[i].title,6);
				_data[i].nameStr = nameStrArr[0];
				_data[i].nameScrollFalg = nameStrArr[1];
				_html += '<div class="main-li" id="mainli-'+i+'"><img class="pic" src="'+_data[i].image+'"/><div class="name"><p><span>'+_data[i].nameStr+'</span></p></div></div>';
			}	
		}else{
			var _html = '';
			var _start = (this.curPage - 2) * 10;
			var _end = (this.curPage + 1) * 10;
			_end = (this.totleNum > _end) ? _end : this.totleNum;	
			var _data = this.data[this.selectIndex].course;
			for(var i = _start; i<_end; i++){
				_data[i].title = (_data[i].title)?_data[i].title:this.data[this.selectIndex].class;
				var nameStrArr = cutStr(_data[i].title,6);
				_data[i].nameStr = nameStrArr[0];
				_data[i].nameScrollFalg = nameStrArr[1];
				_html += '<div class="main-li" id="mainli-'+i+'"><img class="pic" src="'+_data[i].image+'"/><div class="name"><p><span>'+_data[i].nameStr+'</span></p></div></div>';	
			}				
		}
		$('mainLi').innerHTML = _html;
	},
	focusIn: function() {
		if(this.area == 0){
			addClass('li-'+this.index,'over');
		}else if(this.area == 1){
			this.nameScroll();
			var curEle = 'mainli-'+this.picIndex;
			addClass(curEle,'cur');
		}
		this.addFocus();
	},	
	focusOut:function(){
		if(this.area == 0){
			removeClass('li-'+this.index,'over');
		}		
	},
	addFocus:function(){
			var that = this;
			if(this.area == 0){
				bfs.up = function(){
					if(that.index <= 0) return;	
					var _page = Math.ceil(that.data.length /6);
					var _num = that.data.length %6;
					var _num2 = 6 - _num;
					console.log(_num);
							
					if(that.index == (that.listPage-1)*5 + (that.listPage-1)){
						if(that.listPage == _page){
							$('List').style.top = parseInt($('List').style.top) +84*_num+'px';
						}else{
							$('List').style.top = parseInt($('List').style.top) +84*6+'px';	
						};
						Loading = true;
						that.listPage--;
					}
					removeClass('li-'+that.index,'over');
					that.index--;
					addClass('li-'+that.index,'over');
				};
				bfs.down = function(){
					if(that.index >= that.data.length-1) return;
					var _page = Math.ceil(that.data.length /6);
					var _num = that.data.length %6;
					if(that.index == that.listPage*5 + (that.listPage-1)){
						if(that.listPage == _page -1){
							$('List').style.top = parseInt($('List').style.top) -84*_num+'px';
						}else{
							$('List').style.top = parseInt($('List').style.top) -84*6+'px';	
						};
						Loading = true;
						that.listPage++;
					}
					removeClass('li-'+that.index,'over');
					that.index++;
					addClass('li-'+that.index,'over');
				};
				bfs.left = null;
				bfs.right = function(){
					if(that.data[that.selectIndex].course.length > 0){
						that.focusOut();
						that.area = 1;
						that.focusIn();						
					}					
				},
				bfs.enter = function(){
					that.curPage = 1;
					that.picIndex = 0;
					that.selectIndex = that.index;				
					that.toRightHtml();
				};	
			}else if(this.area == 1){
				bfs.up = function(){
					if (that.picIndex < 5) {return}	
					if(that.picIndex < that.pageNum*that.curPage - 5){
						that.nameNormal();
						removeClass('mainli-'+that.picIndex,'cur');					
						$('mainLi').style.webkitTransition = 'top 0.3s ease';
						$('mainLi').style.top = '0px';
						Loading = true;
						that.curPage--;
						that.picIndex-=5;
						that.nameScroll();
					}else{
						that.nameNormal();
						removeClass('mainli-'+that.picIndex,'cur');
						that.picIndex-=5;
						addClass('mainli-'+that.picIndex,'cur');
						that.nameScroll();
					}
				};
				bfs.down = function(){
					if(that.picIndex == that.totleNum-1) return;
						if(that.picIndex >= that.pageNum*that.curPage - 5){
						if(that.curPage == that.totlePage) return;
						that.nameNormal();
						removeClass('mainli-'+that.picIndex,'cur');					
						$('mainLi').style.webkitTransition = 'top 0.3s ease';
						$('mainLi').style.top = '-1016px';
						Loading = true;
						that.curPage++;
						that.picIndex+=5;
						if(that.picIndex > that.totleNum-1) that.picIndex = that.totleNum-1;						
					}else{
						that.nameNormal();
						removeClass('mainli-'+that.picIndex,'cur');
						that.picIndex+=5;
						if(that.picIndex > that.totleNum-1) that.picIndex = that.totleNum-1;
						addClass('mainli-'+that.picIndex,'cur');
						that.nameScroll();					
					}
				};
				bfs.left = function(){
					if(that.picIndex % 5 == 0){
						that.nameNormal();
						removeClass('mainli-'+that.picIndex,'cur');
						that.area = 0;
						that.focusIn();										
					}else{
						that.nameNormal();
						removeClass('mainli-'+that.picIndex,'cur');
						that.picIndex--;
						addClass('mainli-'+that.picIndex,'cur');
						that.nameScroll();
					}						
				};
				bfs.right = function(){
					if(that.picIndex % 5 == 4 || that.picIndex+1 > that.totleNum-1){return}	
					that.nameNormal();
					removeClass('mainli-'+that.picIndex,'cur');
					that.picIndex++;
					addClass('mainli-'+that.picIndex,'cur');
					that.nameScroll();
				};
				bfs.enter = function(){
					var _id = that.data[that.index].course[that.picIndex].id;
					var _action = that.data[that.index].course[that.picIndex].action;
					//var _url = 'http://sns.is.ysten.com/CNTV/index.html?action=detail&object='+_id;
					//openDetail(_url);
					Play(_action,_id,'')
				};
			}
	},
	nameNormal:function(){
		if(this.data[this.selectIndex].course[this.picIndex].nameScrollFalg){
			clearInterval(this.timer);
			var scrollIn = $('mainli-'+this.picIndex).getElementsByTagName("p")[0].getElementsByTagName("span")[0];
			scrollIn.innerHTML = this.data[this.selectIndex].course[this.picIndex].nameStr;
			scrollIn.style.width = '100%';
			scrollIn.style.left = 0;			
		}
	},
	nameScroll:function(){
		if(this.data[this.selectIndex].course[this.picIndex].nameScrollFalg){
			clearInterval(this.timer);
			var scrollIn = $('mainli-'+this.picIndex).getElementsByTagName("p")[0].getElementsByTagName("span")[0];
			scrollIn.innerHTML = this.data[this.selectIndex].course[this.picIndex].title + '&nbsp;&nbsp;' + this.data[this.selectIndex].course[this.picIndex].title + '&nbsp;&nbsp;';
			scrollIn.style.width = 'auto';
			scrollIn.style.left = 0;
			var imw = parseInt(scrollIn.offsetWidth / 2);
			this.timer = setInterval(function() {
				if (Math.abs(parseInt(scrollIn.style.left)) >= imw) {
					scrollIn.style.left = 0
				} else {
					scrollIn.style.left = parseInt(scrollIn.style.left) - 1 + 'px';
				}
			}, 35);
		}	
	}
};
show('dataLoad')
getData(dataUrl,function(data){
	primary = new Primary();
	primary.init(data);	
})

