var title=document.getElementById('title');
		document.onkeydown=function(e){
		var t = parseFloat(title.style.top) || title.offsetTop;
			if(t<0){
				if(e.keyCode==38){//上
				title.style.top= t + 40+"px";
				// alert(t)
				
			}
			}
			if(t>-300){
				if(e.keyCode==40){//下
				title.style.top= t - 40 +"px";
				
			}
			}
		if(e.keyCode=="27"){
			window.close();
		}
	}