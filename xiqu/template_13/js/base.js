function getData(url,successfun,failurefn) {
	failurefn = (failurefn != undefined)?failurefn:function(){console.log('数据读取错误')};
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			var status = xhr.status;
			if(status == 200){
				var data =  JSON.parse(xhr.responseText);
				successfun(data);
			}else{
				failurefn();
			}
		};
	};
	xhr.open('GET',url,true);
	xhr.send();
};
function cutStr(name,num){
	var num = num*2;
	var len = 0;
	var scrollFalg = false;
	var newStr = '';
	for (var i = 0; i < name.length; i++) {
		var single = name.charAt(i);
		if (single.match(/[^\x00-\xff]/ig) != null) {
			len += 2;
		} else {
			len += 1;
		}
		if(len <= num){
			newStr += single;
		}
	};
	if (len > num) {
		scrollFalg = true;
	}	
	if(scrollFalg){
		var nameStr = newStr+'...';
	}else{
		var nameStr = name;
	}
	return [nameStr,scrollFalg];
};
function $(id){
	return document.getElementById(id);
};
function hasClass(id, cls) {
	if(typeof(id) == 'string'){
		return $(id).className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}else{
		return id.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
};
function addClass(id, cls) {
	if(typeof(id) == 'string'){
		if (!this.hasClass(id, cls)) {$(id).className += " " + cls;}
	}else{
		if (!this.hasClass(id, cls)) {id.className += " " + cls;}
	}
};
function removeClass(id, cls) {
	if (hasClass(id, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		if(typeof(id) == 'string'){
			$(id).className = $(id).className.replace(reg, ' ');
		}else{
			id.className = id.className.replace(reg, ' ');
		}
	}
};
function show(id){
	$(id).style.display = 'block';
};
function hide(id){
	$(id).style.display = 'none';
};
function getArrIndex(ele,arr){
	for(var i = 0; i<arr.length; i++){
		if(arr[i] == ele){
			return i;
			break;	
		}
	}	
}


/*键值*/
var KEY_LEFT = 37;      //
var KEY_UP = 38;        //
var KEY_RIGHT = 39;     //
var KEY_DOWN = 40;      //
var KEY_ENTER = 13;     //
var KEY_BACK = 27;      //BACKSPACE
var KEY_HOME = 36;      //(Home)
var Loading = false;    //默认焦点可以走
/*焦点*/
var bfs = function(){
	var obj={};
	obj.fnFocus = function(){	
		if(Loading) {return}
		//if(Loading2) {return}
		if(event && event.keyCode) {
			switch(event.keyCode) {
				case KEY_UP:
					if(obj.up)obj.up();
					break;
				case KEY_DOWN:
					if(obj.down)obj.down();
					break;
				case KEY_LEFT:
					if(obj.left)obj.left();
					break;
				case KEY_RIGHT:
					if(obj.right)obj.right();
					break;
				case KEY_ENTER:
					if(obj.enter)obj.enter();
					break;
				case KEY_BACK:
					obj.backFn?obj.backFn():pageClose();
					break;
				default:
					break;
			}
		}
	}
	return obj;
}();
document.onkeydown = bfs.fnFocus;
function pageClose(){
	if(window.widget && window.widget.exit) {
		window.widget.exit();
	} else {
		window.close();
	}
};
function GetQueryString(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if(r != null){return unescape(r[2])};
    return '';
}







