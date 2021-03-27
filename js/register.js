function register(){
    if(!$("#username").val()||!$("#password").val()){
        alert_danger("用户名或密码不能为空");
        return false;
    }
    var ivc = $.getUrlParam("ivc");
    ivc = ivc?'?ivc='+ivc:'';
    $.ajax({
        type: "POST",
        dataType: "json",
        url: api_path + "/user/reg/qq" + ivc,
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
$(function (){
    if($.getUrlParam("reg_code")&&$.getUrlParam("qq")){
      $("#step_desc").text("第二步：完成注册");
      $("#progress-bar").css("width","100%");
      $("#staticQQ").val($.getUrlParam("qq"));
      $("#regCode").val($.getUrlParam("reg_code"));
      $("#list-first").removeClass("show active");
      $("#list-second").addClass("show active");
    }
});