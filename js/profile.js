function load_manager_platform(item){
    var title = "未知";
    if(item["status"]==1) title = "通过";
    if(item["status"]==2) title = "审核中";
    if(item["status"]==3) title = "拒绝";
    var html = '<div class="card" style="width: 12rem;">'+
    '<div class="card-body">'+
      '<h5 class="card-title"><a href="'+item["url"]+'" target="_blank">'+item["name"]+'</a></h5>'+
      '<h6 class="card-subtitle mb-2 text-muted">状态：'+title+'</h6>'+
      '<p class="card-text">'+item["desc"]+'</p>'+
      '<a href="javascript:del_platform('+item['id']+');" class="card-link">删除</a>'+
      '<a class="card-link" data-id="upd-platform" data-item-id="'+item['id']+'" data-toggle="modal" data-target="#staticBackdrop">编辑</a>'+
    '</div>'+
  '</div>';
    $("#platforms").append(html);
}
function load_manager_blog(item){
    var title = "未知";
    if(item["status"]==1) title = "通过";
    if(item["status"]==2) title = "审核中";
    if(item["status"]==3) title = "拒绝";
    var type = 'blog';
    if(item["type"]==2) type = 'github';
    if(item["type"]==3) type = 'forum';
    if(item["type"]==4) type = 'team';
    if(item["type"]==5) type = 'wechat';
    var html = '<div class="card" style="width: 10rem;">'+
    '<img src="/img/'+type+'/'+item['logo']+'" class="card-img-top" alt="...">'+ 
    '<div class="card-body">'+
      '<h5 class="card-title"><a href="'+item["url"]+'" target="_blank">'+item["name"]+'</a></h5>'+
      '<h6 class="card-subtitle mb-2 text-muted">状态：'+title+'</h6>'+
      '<p class="card-text">'+item["categroy"]+'</p>'+
      '<a href="javascript:del_blog('+item['id']+');" class="card-link">删除</a>'+
      '<a class="card-link" data-id="upd-blog" data-item-id="'+item['id']+'" data-toggle="modal" data-target="#staticBackdrop">编辑</a>'+
    '</div>'+
  '</div>';
    $("#blogs").append(html);
}
// 加载用户的管理数据
function load_manager(){
    $.ajax({
        type: "GET",
        url: api_path + "/user/manager",
        contentType: "application/json",
        success:function (res) {
            if(!res){
                alert("服务器错误");
            }else if(res["success"]){
                var json = res["data"];

                $("#platforms").html("");
                if(json["platform"].length>0){
                    $.each(json["platform"], function (i, item) {
                        load_manager_platform(item);
                    });
                }else{
                    $("#platforms").append('<h2 class="text-center">你还没有添加过练习平台呢~~~</h2>');
                }

                $("#blogs").html("");
                if(json["blog"].length>0){
                    $.each(json["blog"], function (i, item) {
                        load_manager_blog(item);
                    });
                }else{
                    $("#blogs").append('<h2 class="text-center">你还没有添加过博客论坛呢~~~</h2>');
                }
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
$(function (){
    var session = Cookies.get('session');
    if(!session){
        $(location).prop('href', '/profile/login');
    }else{
        $('#staticBackdrop').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget)
            var data_id = button.data('id')
            if(data_id == "add-blog"){
                $("#staticBackdropLabel").text("博客论坛");
                $("#staticOptButton").text("添加");
                $("#addBlogModalBody").show();
                $("#addPlatformModalBody").hide();
            }else if(data_id == "add-platform"){
                $("#staticBackdropLabel").text("练习平台");
                $("#staticOptButton").text("添加");
                $("#addBlogModalBody").hide();
                $("#addPlatformModalBody").show();
                $("#p_id").val("");
                $("#p_name").val("");
                $("#p_url").val("");
                $("#p_desc").val("");
            }else if(data_id == "upd-platform"){
                $("#staticBackdropLabel").text("练习平台");
                $("#staticOptButton").text("更新");
                $("#addBlogModalBody").hide();
                $("#addPlatformModalBody").show();
                upd_platform(button.data('item-id'));
            }else if(data_id == "upd-blog"){
                $("#staticBackdropLabel").text("博客论坛");
                $("#staticOptButton").text("更新");
                $("#addBlogModalBody").show();
                $("#addPlatformModalBody").hide();
                upd_blog(button.data('item-id'));
            }
        });
        // 加载账号信息
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
                    $("#qq_public").attr("checked", json["qq_visiable"]);
                    if(json["openid"]){
                        $("#openid").text(json["openid"]);
                    }else{
                        $("#openid").html("<a href='/profile/wx_bind'>绑定微信</a>");
                    }
                    $("#avatar").attr("src", "/img/users/" + json["headimg"]);
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
        $('a[data-toggle="list"]').on('shown.bs.tab', function (event) {
            if(event.target.id=="list-manager-list"){
                load_manager();
            }
        });
    }
})
// 重置密码
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
function showLogoFile(file){
    console.log(file);
    if(window.FileReader) {
		var reader = new FileReader();
	} else {
		alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
	}
    reader.readAsDataURL(file);
    $("#blog_logo_label").text(file.name);
}
function showAvatarFile(file){
    console.log(file);
    if(window.FileReader) {
		var reader = new FileReader();
	} else {
		alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
	}
    reader.onload = function(e) {
		$("#avatar").attr("src", e.target.result);
	};
    reader.readAsDataURL(file);
    $("#filename_label").text(file.name);
}
// 修改头像
function upload_avatar(){
    var formData = new FormData(); 
    formData.append('file', $('#avatarFile')[0].files[0]);
    $.ajax({
        url: api_path + '/user/upload_avatar',
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            if(data.success){
                $("#avatar").attr("src", data.data.image);
                alert(data.msg);
            }else{
                alert(data.msg);
            }
        },
        error: function (data) {
            alert("上传失败");
        }
    })
}
function upsert_data(){
    if($("#addPlatformModalBody").is(":visible")){
        var platform = {};
        var url_path = "add_platform";
        if(!$("#p_name").val()) {
            alert("请填写平台名称");
            return false;
        }
        platform["name"] = $("#p_name").val();
        if(!$("#p_url").val()){
            alert("请填写平台网址");
            return false;
        }
        platform["url"] = $("#p_url").val();
        if(!$("#p_desc").val()){
            alert("请填写平台简介");
            return false;
        }
        platform["desc"] = $("#p_desc").val();
        if($("#staticOptButton").text()=="更新"){
            platform["id"] = $("#p_id").val();
            url_path = "upd_platform";
        }
        $.ajax({
            type: 'POST',
            url: api_path + '/user/' + url_path,
            dataType: "json",
            data: platform,
            success: function (data) {
                if(data.success){
                    if(url_path == "add_platform"){
                        alert("添加成功");
                    }else{
                        alert("更新成功");
                    }
                    load_manager();
                }else{
                    alert(data.msg);
                }
            },
            error: function (data) {
                alert("上传失败");
            }
        })
    }else if($("#addBlogModalBody").is(":visible")){
        var formdata = new FormData(); 
        var url_path = "add_blog";

        if(!$("#b_name").val()) {
            alert("请填写网站名称");
            return false;
        }
        formdata.append('name', $("#b_name").val());

        if(!$("#b_type").val()){
            alert("请选择网站类型");
            return false;
        }
        formdata.append('type', $("#b_type").val());

        if(!$("#b_url").val()){
            alert("请填写网站网址");
            return false;
        }
        formdata.append('url', $("#b_url").val());

        if(!$("#b_logo").val()){
            alert("请选择网站图标");
            return false;
        }else{
            formdata.append('logo', $('#b_logo')[0].files[0]);
        }

        if(!$("#b_categroy").val()){
            alert("请填写网站分类");
            return false;
        }
        formdata.append('categroy', $("#b_categroy").val());

        if($("#staticOptButton").text()=="更新"){
            formdata.append('id', $("#b_id").val());
            url_path = "upd_blog";
        }
        $.ajax({
            url: api_path + '/user/' + url_path,
            type: 'POST',
            cache: false,
            data: formdata,
            processData: false,
            contentType: false,
            success: function (data) {
                if(data.success){
                    if(url_path == "add_blog"){
                        alert("添加成功");
                    }else{
                        alert("更新成功");
                    }
                    load_manager();
                }else{
                    alert(data.msg);
                }
            },
            error: function (data) {
                alert("上传失败");
            }
        })
    }
}
function del_platform(pid){
    $.ajax({
        type: 'GET',
        url: api_path + '/user/del_platform?id='+pid,
        success: function (data) {
            if(data.success){
                load_manager();
            }else{
                alert(data.msg);
            }
        },
        error: function (data) {
            alert("删除失败");
        }
    })
}
function upd_platform(pid){
    $.ajax({
        type: 'GET',
        url: api_path + '/user/get_platform?id='+pid,
        success: function (data) {
            if(data.success){
                $("#p_id").val(data.data.id);
                $("#p_name").val(data.data.name);
                $("#p_url").val(data.data.url);
                $("#p_desc").val(data.data.desc);
            }else{
                alert(data.msg);
            }
        },
        error: function (data) {
            alert("删除失败");
        }
    })
}

function del_blog(bid){
    $.ajax({
        type: 'GET',
        url: api_path + '/user/del_blog?id='+bid,
        success: function (data) {
            if(data.success){
                load_manager();
            }else{
                alert(data.msg);
            }
        },
        error: function (data) {
            alert("删除失败");
        }
    })
}
function upd_blog(bid){
    $.ajax({
        type: 'GET',
        url: api_path + '/user/get_blog?id='+bid,
        success: function (data) {
            if(data.success){
                $("#b_id").val(data.data.id);
                $("#b_name").val(data.data.name);
                $("#b_type").val(data.data.type);
                $("#b_url").val(data.data.url);
                $("#b_logo").val("");
                $("#b_categroy").val(data.data.categroy);
            }else{
                alert(data.msg);
            }
        },
        error: function (data) {
            alert("删除失败");
        }
    })
}
