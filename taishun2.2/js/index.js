var now=1;
		var list=document.getElementById('ul').children;
		document.onkeydown=function(e){
			if(e.keyCode==27){
				window.close();
			}
			switch(e.keyCode){
				case 37://左
				now--;
				if(now<=1){
					now=1;
				}
				break;
				case 39://右
				now++;
				if(now>=2){
					now=2;
				}
				break;
			}
			for(var i=1;i<list.length;i++){
				list[i].className="";
				if(i==now){
					list[i].className="now";
					if(i==1){
						if(e.keyCode=="13"){
							window.open("imp.html");
						}
					}else if(i==2){
						if(e.keyCode=="13"){
							window.open("news.html");
						}
					}
				}
			}
		}