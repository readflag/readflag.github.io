function load_blogs_items(data){
	$("#contents").html("");
	var html = '<div class="row row-cols-8 row-cols-md-8 mt-3">';
	$.each(data["result"], function (i, item) {
		// id,name,type,url,logo
		// blog:1,github:2,forum:3,team:4
		var type = 'blog';
		if(item["type"]==2){
			type = 'github';
		}else if(item["type"]==3){
			type = 'forum';
		}else if(item["type"]==4){
			type = 'team';
		}
		var url = item["url"] + '?fr=readflag';
		var logo = item["logo"];
		if(!logo.startsWith("http")){
			logo = window.location.origin + '/img/' + type + '/' + item["logo"];
		}
		html += '<div class="col col-sm-1-8 mb-3">'+
		'<div class="card">'+
			'<img src="'+logo+'" class="card-img-top" alt="'+item["name"]+'">'+
			'<div class="card-body">'+
				'<h5 class="card-title"><a href="'+url+'" target="_blank" title="'+item["name"]+'">'+item["name"]+'</a></h5>'+
				'<p class="card-text">未分类</p>'+
			'</div>'+
		'</div></div>';
	});
	html += "</div>";
	$("#contents").append(html);
	$("#contents").append(page_html(data["total"],data["size"],data["page"]));
}
function list(page){
	query_params = page?'?page='+page:'';
	// blog:1,github:2,forum:3,team:4
	var type = parseInt($(".btn-secondary:first").attr("data-id"));
	query_params += type > 0?(query_params.length>0?'&':'?')+'type='+type:'';
	$.ajax({
		type: "POST",
		url: api_path + "/blogs/list" + query_params,
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({'keyword': $("input[type='search']").val()}),
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
$(function (){
	list();
	$(".btn-group button").click(function(){
		$(this).siblings().addClass("btn-outline-secondary").removeClass("btn-secondary");
		$(this).removeClass("btn-outline-secondary").addClass("btn-secondary");
		list();
	});
})
