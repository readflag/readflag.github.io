function load_tools_items(data){
	$("#contents").html("");
	var html = '<div class="row">';
	$.each(data["result"], function (i, item) {
		var tool_url = item["url"].startsWith("http")?item["url"]:(window.location.origin + '/' + item["url"]);
		html += '<div class="col-sm-3">'+
		'<div class="card border-primary mb-3" style="width: 16rem;">'+
			'<div class="card-body">'+
				'<h5 class="card-title">'+item["title"]+'</h5>'+
				// '<h6 class="card-subtitle mb-2 text-muted">描述信息</h6>'+
				'<a href="'+tool_url+'" target="_blank" class="card-link">打开</a>'+
				'<a class="card-link btn btn-link" data-clipboard-text="'+tool_url+'">复制链接</a>'+
				// '<button class="card-link">收藏</button>'+
			'</div>'+
		'</div></div>';
	});
	html += '</div>';
	$("#contents").append(html);
	// 处理分页
	$("#contents").append(page_html(data["total"],data["size"],data["page"]));
}
function list(page){
	page = page?'?page='+page:'';
	$.ajax({
		type: "POST",
		url: api_path + "/tools/list" + page,
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({'keyword': $("input[type='search']").val()}),
		success:function (res) {
			if(res && res["success"]){
				load_tools_items(res["data"]);
			}else{
				console.log(res["msg"]);
			}
		}
	});
	window.scrollTo(0,0);
}
$(function (){
	list();
	// toastr.options.positionClass = 'toast-center-center';
	var clipboard = new ClipboardJS('.btn');
	clipboard.on("success", function (e) {
		toastr.info('复制成功');
	});
})