function show_message(msg){
    $('.toast-body').html(msg);
    $('.toast').toast({delay: 10000});
    $('.toast').toast('show');
}
function get_reg_code(){
    var qq = $("#qq1").val();
    var pass = $("#password1").val();
    if(!qq || !pass){
        show_message("QQ号或操作密码不能为空");
        return false;
    }
    var query_params = "?pwd="+pass+"&qq="+qq;
	$.ajax({
		type: "GET",
		url: api_path + "/user/reg/code" + query_params,
		success:function (res) {
			if(res && res["success"]){
                show_message("QQ："+qq+"，注册验证码为："+res["data"]["reg_code"]+"，<a href='"+res["data"]["url"]+"' target='_blank'>点击跳转</a>");
			}else{
				show_message(res["msg"]);
			}
		}
	});
}
function get_reset_code(){
    var qq = $("#qq2").val();
    var pass = $("#password2").val();
    if(!qq || !pass){
        show_message("QQ号或操作密码不能为空");
        return false;
    }
    var query_params = "?pwd="+pass+"&qq="+qq;
	$.ajax({
		type: "GET",
		url: api_path + "/user/reset/code" + query_params,
		success:function (res) {
			if(res && res["success"]){
                show_message("QQ："+qq+"，重置密码验证码为："+res["data"]["reset_code"]);
			}else{
				show_message(res["msg"]);
			}
		}
	});
}