$(function (){
    var session = Cookies.get('session');
    if(!session){
        $(location).prop('href', '/profile/login');
    }else{
        $.ajax({
            type: "GET",
            url: api_path + "/user/info",
            contentType: "application/json",
            success:function (res) {
                if(!res){
                    alert("服务器错误");
                }else if(res["success"]){
                    var json = res["data"];
                    $("#uid").text(json["id"]);
                    $("#invite").text("http://readflag.cn/profile/register?iv="+json["id"]);
                    $("#nickname").text(json["nickname"]);
                    if(json["qq_id"]){
                        $("#qq").text(json["qq_id"]);
                    }
                    $("#qq_public").attr("checked", !json["qq_visiable"]);
                    if(json["openid"]){
                        $("#openid").text(json["openid"]);
                    }else{
                        $("#openid").html("<a href='/profile/wx_bind'>绑定微信</a>");
                    }
                    $("#avatar").html('<img src="'+json["headimg"]+'" alt="这里是头像" />');
                    $("#intro").val(json["desc"]);
                    $("#menu").removeClass("invisible");
                }else if(res["msg"]){
                    alert(res["msg"]);
                }else{
                    console.log(res);
                    alert("未知错误");
                }
            },
            error: oauth_error
        });
    }
})
function reset_pass(){
    if(!$("#password").val()||$("#password").val().length < 6){
        alert_danger("密码最少6位");
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: api_path + "/user/reset/pass",
        data: $('#form_change_pass').serialize(),
        success:function (res) {
            if(res && res["success"]){
                alert("更新成功");
            }else if(res && !res["success"]){
                alert_danger(res["msg"]);
            }else{
                console.log(res);
                alert_danger("未知错误");
            }
        },
        error:function(){
            alert_danger("服务器错误");
        }
    });
}