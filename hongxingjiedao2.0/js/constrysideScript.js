var box=document.getElementById('box');
		document.onkeydown=function(e){
		var t = parseFloat(box.style.top) || box.offsetTop;
			if(t<0){
				if(e.keyCode==38){//上
				box.style.top= t + 100 +"px";
				// alert(t)
				
			}
			}
			if(t>-350){
				if(e.keyCode==40){//下
				box.style.top= t - 100 +"px";
				
			}
			}
		if(e.keyCode=="27"){
			window.close();
		}
	}