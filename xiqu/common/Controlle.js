/**
 * @author 张勇
 *专题模板控制器
 */
function Controlle() {}
Controlle.prototype = {
    initialize : function(__pos){
        controlle.templateUI.initialize(__pos)
    },
	keyDownFun : function(__event) {
		switch(__event.keyCode) {
			case 37:
				//左
                controlle.templateUI.do_left();
				break;
			case 38:
				//上
                controlle.templateUI.do_up();
				break;
			case 39:
				//右
                controlle.templateUI.do_right();
				break;
			case 40:
				//下
                controlle.templateUI.do_down();
				break;
			case 13:
                controlle.templateUI.do_select();
				break;
			case 27:
			case 8:
                controlle.do_back();
				break;
			default :
				break;
		}
	},
	do_back : function() {
			if(fromTo){
				window.history.go(-1)
			}else{
				if(window.widget && window.widget.exit) {
					window.widget.exit();
				} else {
					window.close();
				}
			}
		}
}
/*无缝滚动对象*/
function ScrollStart() {
	this.scllorObj = "";
	//滚动对象
	this.coutentObj = "";
	//内容对象
	this.CoutentCopyObj = "";
	//内容复制对象
	this.scllorWidth = "";
	//内容对象宽度
	this.maxWidth = "";
	//最大宽度
	this.speed = 5;
	//速度
	this.content = "";
	this.timer = null;
	this.preObj = null;
	this.satarScroll = null;
}

ScrollStart.prototype = {
	scrollInit : function(__pre, __next, __id, __pid, __maxWidth) {//滚动对象ID前缀，复制对象ID前缀，对象id，复制对象后缀，最大宽度
		this.maxWidth = __maxWidth;
		this.scllorObj = $(__pre + __id);
		this.coutentObj = $(__next + __id);
		this.CoutentCopyObj = $(__next + __id + __pid);
		this.scllorWidth = this.CoutentCopyObj.scrollWidth;
		if(this.scllorWidth > this.maxWidth) {
			this.scllorObj.style.width = this.scllorWidth * 2 + 50 + "px";
			this.CoutentCopyObj.style.width = this.scllorWidth + "px";
			this.coutentObj.innerHTML = this.CoutentCopyObj.innerHTML;
			this.coutentObj.style.width = this.scllorWidth + "px";
			this.CoutentCopyObj.style.position = "absolute";
			this.CoutentCopyObj.style.left = this.scllorWidth + 22 + "px";
			this.CoutentCopyObj.style.top = 0 + "px";
			this.content = this.coutentObj.innerHTML;
			this.scrollSport();
		}
	},
	scrollSport : function() {
		var self = this;
		(function scrollAuto() {
			if(parseInt(self.scllorObj.style.left) <= -(parseInt(self.scllorWidth) + 22)) {
				self.scllorObj.style.left = 0;
			} else {
				self.scllorObj.style.left = parseInt(self.scllorObj.style.left) - 2 + "px";
			}
			self.timer = window.setTimeout(scrollAuto, self.speed);
		})();
	}
}
