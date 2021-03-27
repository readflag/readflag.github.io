function resetpass(){
    if(!$("#qq").val()||!$("#password").val()||!$("#code").val()){
        alert_danger("参数不能为空");
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: api_path + "/user/reset/qq",
        data: $('#form').serialize(),
        success:function (res) {
            if(res && res["success"]){
                $(location).prop('href', '/profile/login');
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