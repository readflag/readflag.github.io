function checkvalue() {
    var amount = parseFloat($("input[name='amount']").val());
    $("input[name='amount']").val(amount);
}
function changetype() {
    $("#amountchose").hide();
    $("#inputtip").hide();
    $("#amountinput").show();
    $("#choseamount").removeAttr("name");
    $("#inputamount").attr("name","amount");
}
function change() {
    var contents=['加油','努力赚钱','不要被消灭！','努力活下去','成为最贫穷的人！'];
    var content = contents[Math.floor(Math.random() * contents.length)];
    $("input[name='body']").val(content);
}
var setOrder;
var time;
function close_modal(){
    if(setOrder){
        clearInterval(setOrder);
    }
}
function check() {
    var amount = parseFloat($("select[name='amount']").val());
    if(amount>0===false){
        amount=parseFloat($("input[name='amount']").val());
        if(amount>0===false){
            alert("请选择正确的金额");
            return false;
        }
    }
    $.ajax({
        type: "POST",
        url: api_path + "/reward/qrpay",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            amount: amount,
            subject: $("input[name='body']").val()
        }),
        success:function (res) {
            if(res && res["success"]){
                console.log("result: "+JSON.stringify(res["data"]));
                var qr = res["data"]["qrcode"];
                var no = res["data"]["orderNo"]
                if(qr.startsWith("https://")){
                    $("#paymoney").text('￥'+amount);
                    $('#qrcode').text("");
                    clearInterval(setOrder);
                    $('#qrcode').qrcode({
                        width: 250,
                        height: 250,
                        border: 25,
                        render: "canvas",
                        correctLevel: 0,
                        text: qr
                    });
                    time = 300;
                    setOrder = setInterval(function() {
                        if(time>0){
                            time--;
                            $("#outdate").text(Math.floor(time/60)+"分"+(time%60)+"秒后过期");
                            $.get(api_path + "/reward/notify", {"orderNo": no}, function (info) {
                                console.log("info: "+info);
                                info = JSON.parse(info);
                                if(info && info.id){
                                    $("#outdate").text("感谢您的打赏");
                                    clearInterval(setOrder);
                                }
                            })
                        }else{
                            $("#outdate").text("二维码已过期");
                            clearInterval(setOrder);
                        }
                    }, 1000);
                    $("#myModal").modal();
                }
            }else{
                console.log(res["msg"]);
            }
        }
    });
}
$(function () {
    change();
    $.ajax({
		type: "GET",
		url: api_path + "/reward/notify",
		success:function (res) {
			if(res && res["success"]){
				console.log(res["data"]);
                data = res["data"];
                if(data && data.recent && data.total.order > 0){
                    $("#items").text("");
                    var total = 0;
                    for(var i = 0; i < data.lastest.length; i++){
                        $("#items").append("<div class=\"item\">\n" +
                        "                        <span class=\"price\">￥"+data.lastest[i].mount+"</span>\n" +
                        "                        <p class=\"item-name\">"+data.lastest[i].notify_time+"</p>\n" +
                        "                        <p class=\"item-description\">来自于<b>"+data.lastest[i].buyer_logon_id+"</b>的留言:&nbsp;&nbsp;"+data.lastest[i].mark+"</p>\n" +
                        "                    </div>");
                        console.log(data.lastest[i]);
                        total += data.lastest[i].mount;
                    }
                    $("#total").text("￥"+total);
                    $("#recent").html("共收到来自["+data.total.order+"]位大爷的打赏，人民币金额共计["+data.total.money+"]元。\n" +
                        "                <br/>\n" +
                        "                最新的一笔在"+data.recent.notify_time+",金额"+data.recent.mount+"元\n<br/>\n您的每次付出，我们皆有记录！");
                }
			}else{
				console.log(res["msg"]);
			}
		}
	});
})