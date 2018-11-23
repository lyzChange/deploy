var box=document.getElementById('box');
	var list=document.getElementsByTagName("IMG");
	var now=0;
	document.onkeydown=function(e){
		switch(e.keyCode){
			case 37://左
			now--;
			if(now<0){
				now=0;
			}
			break;
			case 39://右
			now++;
			if(now>list.length){
				now=list.length-1
			}
			break;
			case 38://上
	        now-=2;
	        if(now<0){
	          now+=2;
	        }
	        break;
	        case 40://下
	        now+=2;
	        if(now>ul.length){
	          now-=2;
	        }
	        break;
			}
			for(var i=0;i<list.length;i++){
				list[i].className="";
				if(i==now){
					list[i].className+="now";

				}
				if(list[i].className=="now"){
					if(list[i].id=="img1"){
						if(e.keyCode=="13"){
							window.open("constryside.html")
						}
					}if(list[i].id=="img2"){
						if(e.keyCode=="13"){
							window.open("news.html")
						}
					}
					if(list[i].id=="img3"){
						if(e.keyCode=="13"){
							window.open("stu.html")
						}
					}
					if(list[i].id=="img4"){
						if(e.keyCode=="13"){
							window.open("active.html")
						}
					}

			}

			}
			if(e.keyCode=="27"){
				window.close();
			}

		}