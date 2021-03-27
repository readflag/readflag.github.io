function login(){
    if(!$("#username").val()||!$("#password").val()){
        alert_danger("用户名或密码不能为空");
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: api_path + "/user/login/qq",
        data: $('#form').serialize(),
        success:function (res) {
            if(res && res["success"]){
                console.log(res);
                Cookies.set('session', res['data']['session'], { expires: 7 })
                var go = $.getUrlParam("goto");
                if(!go){ go = '/profile/'; }
                $(location).prop('href', go);
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