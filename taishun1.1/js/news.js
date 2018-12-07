
var list=document.getElementsByTagName('LI');
	var title=document.getElementById('title');
	var now=0;
	var num=0;
	document.onkeydown=function(e){
		if(e.keyCode=="27"){
			window.close();
		}
		var t=parseFloat(title.style.top)||title.offsetTop;
		switch(e.keyCode){
			case 38://上
			now--;
			if(now<=0){
				now=0;
			}
			if(t<0){
					title.style.top=t+40+"px";
				}
			break;
			case 40://下
			now++;
			if(now==list.length){
				now=list.length-1;
				// now=num;
				// num++;
				if(t>-400){
					title.style.top=t-40+"px";
				}
			}
			break;
		}
		for(var i=0;i<list.length;i++){
				list[i].className="";
				if(i==now){
					list[i].className="now";
					if(i==0){
						if(e.keyCode=="13"){
							window.open("news0.html")
						}
						
					}
					if(i==1){
						if(e.keyCode=="13"){
							window.open("news1.html")
						}
					}
					if(i==2){
						if(e.keyCode=="13"){
							window.open("news2.html")
						}
					}
					if(i==3){
						if(e.keyCode=="13"){
							window.open("news3.html")
						}
					}
					if(i==4){
						if(e.keyCode=="13"){
							window.open("news4.html")
						}
					}
					if(i==5){
						if(e.keyCode=="13"){
							window.open("news5.html")
						}
					}
					if(i==6){
						if(e.keyCode=="13"){
							window.open("news6.html")
						}
					}
				}
			}
	}