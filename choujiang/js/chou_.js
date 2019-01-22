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
        str="<div>"+"恭喜您获得1次新"+"</div>"
        str1="<div class=gbp>"+"年“猪”福，快来点击抽奖 哦！"+"</div>";
        $(".user").append(str)
        $(".user").append(str1)
		$(".image4").show();
		$(".image3").hide();
	}
}else if(datas.resultCode == "1002"){
		console.log(12222221)
		str1="<h3>"+"您离抽奖还差一步"+"</h3>";
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
		str="<div>"+"您的宽带电视账户未办理统一支付，请详询 10086或前往营业厅办理，办理成功后即可抽奖哦！"+"</div>";
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
    var flag = false;
    $(".anniu2").click(function () {
        // if (flag == false) {
        //     var time = [0, 1];
        //     time = time[Math.floor(Math.random() * time.length)];
        //     if (time == 0) {
                
        //     }
        //     if (time == 1) {
                getCli();
                // flag = true;
        //     }
        // }
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
                case 27:
                    $(".gz").hide();
                    $(".tk").hide();
                    $(".tk1").hide();
                   
                break;
        }
        for (var i = 0; i <= list.length; i++) {
            if (i == now) {
                if (e.keyCode == 13) {
                    if (i == 2) {
                        if (datas.resultCode == "0000") { //
                            if (datas.content.flag == 1) {//有一次抽奖次数
                                console.log(2222)
                                $(".anniu2").click();
                                if ($(".jl-tk").show(), $(".wcs").show()) {
                                    $(".jl-tk").hide();
                                    $(".wcs").hide();
                                }
                            }else {//不可抽奖-
                            }
                        }
                        if (datas.resultCode == "1002") { //
                            $(".tk").show();
                            key_en()
                        
                        } 
                        if ($(".jl-tk").show(), $(".wcs").show()) {
                            $(".jl-tk").hide();
                            $(".wcs").hide();
                        }
                        if (datas.resultCode == "1004") {//提示统一支付
                            $(".tk1").show();
                            if (i == 1) {
                                $(".gz").show();
                                console.log(22222)
                            }
                        }
                    }
                    if (i == 1) {
                        $(".gz").show();
                        console.log(22222)
                    }
                }
            }
        }
    }
    //弹框 立即订购
    function key_en(){
        document.onkeydown = undefined;
        $('#ssd').focus()

    }

    $('#ssd').keydown(function (e) {
        switch (e.keyCode) {
            case 13://跳转订购页面
                window.location = "pay_page.html"
            break;
        }
    })
    
    
    var getCli = function () {
        //判断是否投资然后是fou抽奖========================================================
        
        var ajax = new Ajax();
        var ajaxUrl= get_userTVWLottery+"?uuid="+123+"&billId="+'dnpzcHQwMDEyMDMxMTI=';
        ajax.get(ajaxUrl, function (data) {
            data = JSON.parse(data);console.log(data)
            var datas = ['足球','移动电源','15.88元话费','1GB国内流量','8.88元话费','5.88元话费']
                var datas_rotat = [60,120,180,240,300,360]
                if(data.resultMsg=='成功'){
                    //计算指针位置
                    for (var i = 0; i < datas.length; i++) {
                        if(datas[i]==data.content.awardInfo.awardName){
                            rotateFunc(1, datas_rotat[i], data.content.awardInfo.awardName);
                        };
                     }

                    
                    
                    $(".image4").show();    
                    $(".image3").hide();
              
               
                    var t = setInterval(function () {
                        //奖品提示
                        if (data.content.awardInfo.awardName == "移动电源") {
                            $(".texts").html("恭喜您获得：" + data.content.awardInfo.awardName);
                            $(".texts2").html('我们将在48小时之内将奖品赠送至您宽带电视统一支付手机号码'+data.content.mobile+'中，请您关注查收!')
                            $(".texts1").html("");
                            }
                        else if (data.content.awardInfo.awardName == "足球") {
                            $(".texts").html("恭喜您获得：" + data.content.awardInfo.awardName);
                            $(".texts2").html("我们将在48小时之内将奖品赠送至您宽带电视统一支付手机号码中，请您关注查收!")
                            $(".texts1").html("");
                        }
                        else {
                            $(".texts").html("恭喜您获得：" + data.content.awardInfo.awardName);
                            $(".texts2").html("");
                            $(".texts1").html("我们将在七个工作日内与您宽带电视统一支付手机号码"+data.content.mobile+"联系，请您保持手机畅通")
                        }
                        $(".jl-tk").show();


                        $(".image4").hide();
                        $(".image5").show();
                        clearInterval(t);
                        isture = false;
                    }, 3100)
                }else{
                    $(".wcs").show();
                }  
                // timeOut(); //网络超时
                    datas = data.content.mobile
                    console.log(datas);
            });
    }
});

// //中奖名单数据渲染页面 历史数据 下面轮播
var ajax = new Ajax();
var ajaxUrl= Get_tVWBroadcast+"?uuid="+123;
ajax.get(ajaxUrl, function (data) {
    data = JSON.parse(data);
    data = data;
    // console.log(data);
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


