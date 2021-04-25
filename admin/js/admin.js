var event_list;
$(function (){
    var session = Cookies.get('session');
    if(!session){
        $(location).prop('href', '/profile/login?goto='+window.location.pathname);
    }else{
        $.ajax({
            type: "POST",
            url: api_path + "/admin/events/recent",
            contentType: "application/json",
            success:function (res) {
                if(res && res["success"]){
                    event_list = res["data"]["result"];
                }else{
                    console.log(res["msg"]);
                }
            }
        });
        $('a[data-toggle="list"]').on('shown.bs.tab', function (event) {
            if(event.target.id=="list-platform-list"){
                list_platforms();// 加载待审核练习平台
            }else if(event.target.id=="list-blog-list"){
                list_blogs();// 加载待审核博客论坛
            }
        });
        $(".btn-group button").click(function(){
            $(this).siblings().addClass("btn-outline-secondary").removeClass("btn-secondary");
            $(this).removeClass("btn-outline-secondary").addClass("btn-secondary");
            list_blogs();
        });
    }
    $("#event_add").click(function(){
        $("#event_name").html('<input type="text" class="form-control" id="e_name" name="name" maxlength="50">');
    });
    $("#event_update").click(function(){
        var firstname = "";
        var html = '<select class="custom-select" name="id" id="event_id">';
        $.each(event_list, function (i, item) {
            if(i==0){
                html += '<option value="'+item["id"]+'" selected>'+item["name"]+'</option>';
                firstname = item["name"];
                $("#e_link").val(item["link"]);
                $("#e_type").val(item["type"]);
                $("#e_bmks").val(item["bmks"].replace("年","-").replace("月","-").replace("日",""));
                $("#e_bmjz").val(item["bmjz"].replace("年","-").replace("月","-").replace("日",""));
                $("#e_bsks").val(item["bsks"].replace("年","-").replace("月","-").replace("日",""));
                $("#e_bsjs").val(item["bsjs"].replace("年","-").replace("月","-").replace("日",""));
                $("#e_readmore").val(item["readmore"]);
            }else{
                html += '<option value="'+item["id"]+'">'+item["name"]+'</option>';
            }
        });
        html += '</select><input type="text" class="d-none" id="e_name" name="name" value="'+firstname+'">';
        $("#event_name").html(html);
        $('#event_id').on('change',function(){
            if($(this).val()){
                var thisid = $(this).val();
                $.each(event_list, function (i, item) {
                    if(item["id"]==thisid){
                        $("#e_name").val(item["name"]);
                        $("#e_link").val(item["link"]);
                        $("#e_type").val(item["type"]);
                        $("#e_bmks").val(item["bmks"].replace("年","-").replace("月","-").replace("日",""));
                        $("#e_bmjz").val(item["bmjz"].replace("年","-").replace("月","-").replace("日",""));
                        $("#e_bsks").val(item["bsks"].replace("年","-").replace("月","-").replace("日",""));
                        $("#e_bsjs").val(item["bsjs"].replace("年","-").replace("月","-").replace("日",""));
                        $("#e_readmore").val(item["readmore"]);
                    }
                });
            }
        });
    });
});
function upsert_event(){
    if(!$("#e_name").val()){
        alert("比赛名称不能为空");
        return false;
    }
    $.ajax({
        type: "POST",
        dataType: "json",
        url: api_path + "/admin/events/upsert",
        data: $('#event_form').serialize(),
        success:function (res) {
            if(res && res["success"]){
                console.log(res);
                alert("操作成功");
                window.location.reload();
            }else if(res && !res["success"]){
                alert(res["msg"]);
            }else{
                console.log(res);
                alert("未知错误");
            }
        },
        error:function(){
            alert("服务器错误");
        }
    });
}
function load_platforms_items(data){
	$("#list-platform").html("");
	var html = '<div class="row">';
    $.each(data["result"], function (i, item) {
        html += '<div class="card" style="width: 12rem;">'+
            '<div class="card-body">'+
            '<h5 class="card-title"><a href="'+item["url"]+'" target="_blank">'+item["name"]+'</a></h5>'+
            '<p class="card-text">'+item["desc"]+'</p>'+
            '<a href="javascript:verify_platform('+item['id']+',3);" class="card-link">拒绝</a>'+
            '<a href="javascript:verify_platform('+item['id']+',1);" class="card-link">通过</a>'+
            '<a href="javascript:verify_platform('+item['id']+',4);" class="card-link">删除</a>'+
            '</div>'+
        '</div>';
	});
	html += '</div>';
	$("#list-platform").append(html);
    $("#list-platform").append(page_html(data["total"],data["size"],data["page"]));
}
function load_blogs_items(data){
	$("#blog_contents").html("");
	var html = '<div class="row" id="blogs" style="margin: 15px auto;">';
	$.each(data["result"], function (i, item) {
		var type = 'blog';
		if(item["type"]==2){
			type = 'github';
		}else if(item["type"]==3){
			type = 'forum';
		}else if(item["type"]==4){
			type = 'team';
		}else if(item["type"]==5){
			type = 'wechat';
		}
		var logo = item["logo"];
		if(!logo.startsWith("http")){
			logo = window.location.origin + '/img/' + type + '/' + item["logo"];
		}
		var categroy = item["categroy"];
		if(!categroy) categroy = "未分类";
        html += '<div class="card" style="width: 12rem;">'+
        '<img src="'+logo+'" class="card-img-top" alt="...">'+ 
        '<div class="card-body">'+
          '<h5 class="card-title"><a href="'+item["url"]+'" target="_blank">'+item["name"]+'</a></h5>'+
          '<p class="card-text">'+item["categroy"]+'</p>'+
          '<a href="javascript:verify_blog('+item['id']+',3);" class="card-link">拒绝</a>'+
          '<a href="javascript:verify_blog('+item['id']+',1);" class="card-link">通过</a>'+
          '<a href="javascript:verify_blog('+item['id']+',4);" class="card-link">删除</a>'+
        '</div></div>';
	});
	html += "</div>";
	$("#blog_contents").append(html);
	$("#blog_contents").append(page_html(data["total"],data["size"],data["page"]));
}
function list_blogs(page){
	var query_params = page?'?page='+page:'';
	var type = parseInt($(".btn-secondary:first").attr("data-id"));
	query_params += type > 0?(query_params.length>0?'&':'?')+'type='+type:'';
	$.ajax({
		type: "GET",
		url: api_path + "/admin/blog/verify" + query_params,
		success:function (res) {
			if(res && res["success"]){
				load_blogs_items(res["data"]);
			}else{
				console.log(res["msg"]);
			}
		}
	});
	window.scrollTo(0,0);
}
function verify_blog(id,status){
    $.ajax({
		type: "POST",
		url: api_path + "/admin/blog/verify",
        dataType: "json",
        data: {"id": id, "status": status},
		success:function (res) {
			if(res && res["success"]){
				list_blogs();
			}else{
				console.log(res["msg"]);
			}
		}
	});
}
function list_platforms(page){
    var query_params = page?'?page='+page:'';
	$.ajax({
		type: "GET",
		url: api_path + "/admin/platform/verify" + query_params,
		success:function (res) {
			if(res && res["success"]){
				load_platforms_items(res["data"]);
			}else{
				console.log(res["msg"]);
			}
		}
	});
	window.scrollTo(0,0);
}
function verify_platform(id,status){
    $.ajax({
		type: "POST",
		url: api_path + "/admin/platform/verify",
        dataType: "json",
        data: {"id": id, "status": status},
		success:function (res) {
			if(res && res["success"]){
				list_platforms();
			}else{
				console.log(res["msg"]);
			}
		}
	});
}
