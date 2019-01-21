//宽带电视转盘查询接口 判断用户是否有抽奖机会
var datas;
// console.log(getBillId);
var get_bid = get_bi_id_();

// var ajax = new Ajax();
// var ajaxUrl= Get_queryUserTVWLotteryInfo+"?uuid="+123+"&billId="+get_bid + '=';
// ajax.get(ajaxUrl, function (data) {
//     data = JSON.parse(data);
//     datas = data
//     if (data.resultCode == "0000") { //成功
//         // console.log(1111111)
//         if (data.content.flag == "0") { //不可抽奖
//             // console.log(1111111)
//             str = "<h2>" + "太厉害啦！您已抽中" + data.content.awardInfo.awardName + "奖品" + "<h2>";
//             $(".user").append(str)
//             $(".image5").show();
//             $(".image3").hide();
//             $(".image2").show();
//             $(".image1").hide();
//         } else if (data.content.flag == "1") { //可抽奖
//             console.log(222222)
//             str = "<h2>" + "恭喜您获得1次新年“猪”福，快来点击抽奖 哦！" + "</h2>";
//             $(".user").append(str)
//             $(".image4").show();
//             $(".image3").hide();
//         }
//     } else if (data.resultCode == "1002") { //
//         console.log(12222221)
//         str1 = "<h3>" + "您离抽奖还差一步" + "</h3>";
//         str2 = "<span>" + "订购影视动漫VIP包 （39.9元" + "</span>";
//         str3 = "<p>" + "立即参加幸运抽奖哦!" + "</p>"
//         str4 = "<img src='./images/cpb_img.png'>";
//         $(".user").append(str1);
//         $(".user").append(str2);
//         $(".user").append(str3);
//         $(".user").append(str4);
//         $(".anniu").addClass("bl");
//         $(".image4").show();
//         $(".image3").hide();
//     } else if (data.resultCode == "1004") { //
//         str = "<h2>" + "您的宽带电视账户未办理统一支付，请详询 10086或前往营业厅办理，办理成功后即可抽奖哦！" + "</h2>";
//         $(".user").append(str);
//         $(".image5").hide();
//         $(".image4").show();
//         $(".image3").hide();
//     }
    
//     console.log(datas);
//     // $("#jsd").html(JSON.stringify(data))
//     // $('#jrwrtsd').html(JSON.stringify(get_bid))    
// });


var datas = {
    "resultCode": "0000",
    "resultMsg": "成功",
    "content": {
        "flag": "1",
        "mobile": "157****1030",
            "awardInfo":{
                "awardName":"5.88元话费",
                "parValue":"5.88 ",
            "unit":"元"
		}
    }
}
// if(debug){

// }
if(datas.resultCode == "0000"){
	console.log(1111111)
	if(datas.content.flag=="0"){
		console.log(1111111)
		str="<h2>"+"太厉害啦！您已抽中"+datas.content.awardInfo.awardName+"奖品"+"<h2>";
		$(".user").append(str)
		$(".image5").show();
		$(".image3").hide();
		$(".image2").show();
		$(".image1").hide();
	}else if(datas.content.flag=="1"){
		console.log(222222)
		str="<h2>"+"恭喜您获得1次新年“猪”福，快来点击抽奖 哦！"+"</h2>";
		$(".user").append(str)
		$(".image4").show();
		$(".image3").hide();
	}
}else if(datas.resultCode == "1002"){
		console.log(12222221)
		str1="<h1>"+"您离抽奖还差一步"+"</h1>";
		str2="<span>"+"订购影视动漫VIP包 （39.9元)"+"</span>";
		str3="<p>"+"立即参加幸运抽奖哦!"+"</p>"
		str4="<img src='./images/cpb_img.png'>";
		$(".user").append(str1);
		$(".user").append(str2);
		$(".user").append(str3);
		$(".user").append(str4);
		$(".anniu").addClass("bl");
		$(".image4").show();
		$(".image3").hide();	
}else if(datas.resultCode == "1004"){
		str="<h2>"+"您的宽带电视账户未办理统一支付，请详询 10086或前往营业厅办理，办理成功后即可抽奖哦！"+"</h2>";
		$(".user").append(str);
		$(".image5").hide();
        $(".image4").show();
        
		$(".image3").hide();	
	}

//抽奖代码
$(function () {
    var $btn = $('.zhuanzhou'); // 旋转的div
    var cishu = 1; //初始次数，由后台传入
    $('#cishu').html(cishu); //显示还剩下多少次抽奖机会
    var isture = 0; //是否正在抽奖
    var clickfunc = function () {
        var data = [1, 2, 3, 4, 5, 6]; //抽奖
        //data为随机出来的结果，根据概率后的结果
        data = data[Math.floor(Math.random() * data.length)]; //1~6的随机数
        switch (data) {
            case 1:
                rotateFunc(1, 60, '足球');
                break;
            case 2:
                rotateFunc(2, 120, '移动电源');
                break;
            case 3:
                rotateFunc(3, 180, '15.88元话费');
                break;
            case 4:
                rotateFunc(4, 240, '1GB流量');
                break;
            case 5:
                rotateFunc(5, 300, '8.88元话费');
                break;
            case 6:
                rotateFunc(6, 360, '5.88元话费');
                break;
        }
    }
    var flag = false;
    $(".anniu2").click(function () {
        if (flag == false) {
            var time = [0, 1];
            time = time[Math.floor(Math.random() * time.length)];
            if (time == 0) {
                timeOut(); //网络超时
            }
            if (time == 1) {
                getCli();
                flag = true;
            }
        }
    });
    var timeOut = function () {  //超时函数
        $btn.rotate({
            angle: 0,
            duration: 6000,
            animateTo: 2340, //这里是设置请求超时后返回的角度，所以应该还是回到最原始的位置，2160是因为我要让它转6圈，就是360*6得来的
            callback: function () {
                // alert('网络超时')
                $(".wcs").show();
                $(".ok-img").on('click', function () {
                    $(".wcs").hide();
                });
            }
        });
    };
    var rotateFunc = function (awards, angle, text) {
        isture = true;
        $btn.stopRotate();
        $btn.rotate({
            angle: 0, //旋转的角度数
            duration: 3000, //旋转时间
            animateTo: angle + 1440, //给定的角度,让它根据得出来的结果加上1440度旋转
            callback: function () {
                isture = false; // 标志为 执行完毕
                if (text == "移动电源") {
                    $(".texts").html("恭喜您获得：" + text);
                    $(".texts2").html("我们将在48小时之内将奖品赠送至您宽带电视统一支付手机号码139XXXX2428中，请您关注查收!")
                    $(".texts1").html("");
                }
                else if (text == "足球") {
                    $(".texts").html("恭喜您获得：" + text);
                    $(".texts2").html("我们将在48小时之内将奖品赠送至您宽带电视统一支付手机号码139XXXX2428中，请您关注查收!")
                    $(".texts1").html("");
                }
                else {
                    $(".texts").html("恭喜您获得：" + text);
                    $(".texts2").html("");
                    $(".texts1").html("我们将在七个工作日内与您宽带电视统一支付手机号码139XXX2428联系，请您保持手机畅通")
                }

                $(".jl-tk").show();
                $(".cjgz-c").on('click', function () {
                    $(".jl-tk").hide();
                });
                $(".ok-img").on('click', function () {
                    $(".jl-tk").hide();
                    $(".wcs").hide();
                });
            }
        });
    };
    var list = $(".an");
    now = 0;
    var box = document.getElementById("imgdf");
    document.onkeydown = function (e) {
        var t = parseFloat(box.style.top) || box.offsetTop;
        switch (e.keyCode) {
            case 37://左
                now--;
                if (now <= 0) {
                    now += 1;
                }
                if (now <= 0) {
                    now = list.length - 2
                }
                $(".image3").show();
                $(".image4").hide();
                $(".image2").show();
                $(".image1").hide();
                $(".image11").show();
                $(".image12").hide();
                $(".image5").hide();
                if (datas.content.flag == 0) {
                    $(".image5").show();
                    $(".image3").hide();
                    $(".image4").hide();
                    $(".image2").show();
                    $(".image1").hide();
                }
                if (datas.resultCode == "1004") {
                    $(".image5").hide();
                    $(".image3").show();
                }
                if (datas.resultCode == "1002") {
                    $(".image5").hide();
                    $(".image3").show();
                }
                break;
            case 39://右
                now++;
                if (now >= list.length) {
                    now = list.length - 1
                } else if (now >= list.length - 3) {
                    now = list.length - 1
                }
                $(".image4").show();
                $(".image3").hide();
                $(".image2").hide();
                $(".image1").show();
                $(".image12").hide();
                $(".image11").show();
                $(".image5").hide();
                if (datas.content.flag == 0) {
                    $(".image5").show();
                    $(".image3").hide();
                    $(".image4").hide();
                    $(".image2").show();
                    $(".image1").hide();
                }
                if (datas.resultCode == "1004") {
                    $(".image5").hide();
                    $(".image3").show();
                    $(".image4").show();
                    $(".image3").hide();
                    $(".image1").show();
                    $(".image2").hide();
                }
                if (datas.resultCode == "1002") {
                    $(".image5").hide();
                    $(".image4").show();
                    $(".image1").show();
                    $(".image2").hide();
                }
                break;
            case 38://上
                if (t <= 0) {
                    console.log(t);
                    box.style.top = t + 40 + "px";
                    console.log(t);
                }
                now -= 1;
                if (now < 0) {
                    now += 1;
                }
                else if (now <= list.length - 1) {
                    now = list.length - 3
                }
                $(".image11").hide();
                $(".image12").show();
                $(".image2").hide();
                $(".image1").show();
                $(".image3").show();
                $(".image4").hide();
                $(".image5").hide();
                if (datas.content.flag == 0) {
                    $(".image5").show();
                    $(".image3").hide();
                    $(".image4").hide();
                    $(".image2").show();
                    $(".image1").hide();
                }
                if (datas.resultCode == "1004") {
                    $(".image5").hide();
                    $(".image3").show();
                    $(".image1").show();
                    $(".image2").hide();
                }
                if (datas.resultCode == "1002") {
                    $(".image5").hide();
                    $(".image3").show();
                    $(".image1").show();
                    $(".image2").hide();
                }
                break;
            case 40://下
                if (t > -640) {
                    console.log(t);
                    box.style.top = t - 40 + "px";
                    console.log(t);
                }
                now += 1;
                if (now > list.length - 1) {
                    now = list.length - 1
                    //   now=1;
                } else if (now > list.length - 2) {
                    now = list.length - 2
                }
                $(".image1").hide();
                $(".image2").show();
                $(".image3").show();
                $(".image4").hide();
                $(".image12").hide();
                $(".image11").show();
                $(".image5").hide();
                if (datas.content.flag == 0) {
                    $(".image5").show();
                    $(".image3").hide();
                    $(".image4").hide();
                    $(".image2").show();
                    $(".image1").hide();
                }
                if (datas.resultCode == "1004") {
                    $(".image5").hide();
                    $(".image3").show();
                }
                if (datas.resultCode == "1002") {
                    $(".image5").hide();
                    $(".image3").show();
                }
                break;
        }
        
        // for (var i = 0; i <= list.length; i++) {
        //     list[i].classList.remove();
        //     if (i == now) {
        //         list[i].classList.add();
                // if(e.keyCode == 13){
                //     $(".wcs").show();
                //     $(".bg-box").html("sdflasdk");
                // }
                if (e.keyCode == 13) {
                    console.log(2222)
                    $(".bg-box").html("sdflasdk");
                    if (datas.resultCode == "0000") {
                        if (datas.content.flag == 1) {
                            console.log(2222)
                            $(".anniu2").click();
                            if ($(".jl-tk").show(), $(".wcs").show()) {
                                $(".jl-tk").hide();
                                $(".wcs").hide();
                            }
                        }
                    }
                    if (datas.resultCode == "1002") {
                        $(".tk").show();
                        if ($(".tk").show()) {

                        if (i == 0) {
                            window.location.href = "pay_page.html"
                            //点击跳转订购页面
                            console.log(132346)
                        }
                    }
                    }

                    if (datas.resultCode == "1004") {
                        $(".tk1").show();
                        console.log(1111111)
                    }
                    if (i == 2) {
                        if (datas.resultCode == "1002") {

                        } else if (datas.resultCode !== "1002") {
                            if (datas.content.flag == 0) {
                            } else if (datas.content.flag == 1) {
                                $(".anniu2").click();
                            }
                        }
                        if ($(".jl-tk").show(), $(".wcs").show()) {
                            $(".jl-tk").hide();
                            $(".wcs").hide();
                        }
                        console.log(11111)
                    }
                    if (i == 1) {
                        $(".gz").show();

                        console.log(22222)
                    }
                // }
            // }
        }
        if (e.keyCode == "27") {
            if ($(".gz").show()) {
                $(".gz").hide();
            }
            if ($(".tk").show()) {
                $(".tk").hide();
            }
            if ($(".tk1").show()) {
                $(".tk1").hide();
            }
        }
    }
    var getCli = function () {
        //判断是否投资然后是fou抽奖========================================================
        
        var ajax = new Ajax();
        var ajaxUrl= get_userTVWLottery+"?uuid="+123+"&billId="+getBillId+ '=';
        ajax.get(ajaxUrl, function (data) {
            console.log(data);
            data = JSON.parse(data);
            var datas = ['足球','移动电源','15.88元话费','1GB国内流量','8.88元话费','5.88元话费']
                var datas_rotat = [60,120,180,240,300,360]
                if(data.resultMsg=='成功'){
                    //计算指针位置
                    for (var i = 0; i < datas.length; i++) {
                        if(datas[i]==data.content.awardInfo.awardName){
                            rotateFunc(1, datas_rotat[i], data.content.awardInfo.awardName);
                        };
                    }
                }else{
                    $(".wcs").show();
                }
                
                datas = data
                console.log(datas);
        });
       
        var touzi = "没投资11";
        if (touzi == "没投资") {
            $(".ok-img").on('click', function () {
                // $(".zz").hide();
                // $(".today").hide();
                $(".wcs").hide();
            });
        } else {
            if (isture) return; // 如果在执行就退出
            isture = true; // 标志为 在执行
            if (cishu <= 0) { //当抽奖次数为0的时候执行
                $(".wcs").show();
                $(".ok-img").on('click', function () {
                    $(".wcs").hide();
                });
                alert("没有次数了");
                $('#cishu').html(0); //次数显示为0
                isture = false;
            } else { //还有次数就执行
                cishu = cishu - 1; //执行转盘了则次数减1
                if (cishu <= 0) {
                    cishu = 0;
                }
                $('#cishu').html(cishu);
                clickfunc();

                $(".image4").show();
                $(".image3").hide();
                var t = setInterval(function () {
                    $(".image4").hide();
                    $(".image5").show();
                    clearInterval(t);
                    isture = false;
                }, 3000)
            }
        }
    }
});

// //中奖名单数据渲染页面 历史数据 下面轮播
var ajax = new Ajax();
var ajaxUrl= Get_tVWBroadcast+"?uuid="+123;
ajax.get(ajaxUrl, function (data) {
    data = JSON.parse(data);
    data = data;
    console.log(data);
    var str = "<dl>";
    $.each(data.content.broadList, function (i) {
        str += "<dt>" + data.content.broadList[i].obtainTime + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.content.broadList[i].mobile + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.content.broadList[i].awardName + "</dt>";
    });
    str += "</dl>";
    $(".zj-box").append(str);
});
//中奖名单信息
$(function () {
    setInterval(function () {
        $(".zj-box dl").animate({
            marginTop: -45
        }, 2000, function () {
            $(this).children().first().appendTo(this);
            // console.log(this)
            $(this).css({
                marginTop: 0
            });
        });
    }, 3000);
});