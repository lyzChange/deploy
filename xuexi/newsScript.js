
	var box=document.getElementById('box');
		document.onkeydown=function(e){
			var t = parseFloat(box.style.top) || box.offsetTop;
			if(e.keyCode=="27"){
				window.close();
			}
			if(t<0){
				if(e.keyCode==38){//下
				box.style.top= t + 40 +"px";
				console.log(t);
			}
			}
				if(t>-160){
						if(e.keyCode==40){//上
				box.style.top= t - 40 +"px";
				
			}
				}
				

		}