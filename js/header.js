var _hmt = _hmt || [];
(function($){
	$.getUrlParam = function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
	if (window.console) {
        console.groupCollapsed('%c在线工具', 'color:#000; font-size:14px; font-weight:bold;');
        console.log('%cQQ交流群:658858223', 'padding:10px; font-size:20px; line-height:20px; color:white; text-shadow:#33BBFF -1px -3px, 0 0 20px #2addfd;background-image: linear-gradient(to right,#ff0,#990);');
        console.groupEnd();
	}
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?9b65cafc3c07b7543ce36e75452b8d53";
	var s = document.getElementsByTagName("script")[0]; 
	s.parentNode.insertBefore(hm, s);
})(jQuery);
// 回车搜索
function search(e){
	if(e.keyCode === 13){
		try {
			if (typeof(eval("list")) == "function") {
				list();
			}
		} catch (e) {
			console.log("no search");
		}
	}
	return true;
}
/**
 * 显示分页
 * @param {数据总数} total 
 * @param {每页数据数} size 
 * @param {当前页数1~n} page 
 * @param {分页显示页码数} page_show 
 */
function page_html(total,size,page,page_show=5){
	var page_total = parseInt((total - 1)/size) + 1;
	var page_margin = parseInt((page_show-1)/2);
	var page_from = page > page_margin ? page - page_margin : 1;
	var page_to = page <= page_total-page_margin ? page + page_margin : page_total;
	if(page_to - page_from < page_show){
		if(page_from == 1 && page_to < page_total){
			page_to = page_from + page_show - 1 < page_total ? page_from + page_show - 1 : page_total;
		}else if(page_to == page_total && page_from > 1){
			page_from = page_to - page_show + 1 > 1? page_to - page_show + 1 : 1;
		}else if(page_from > 1 && page_to < page_total){
			if (page - page_from <= page_to - page){
				page_from -= 1;
			}else{
				page_to += 1;
			}
		}
	}
	var html = '<nav aria-label="Page navigation example"><ul class="pagination justify-content-end">';
	if (page_to < page_total){
		html += '<li class="page-item">'+
			'<a class="page-link" href="#" aria-label="Previous">'+
			'<span aria-hidden="true">&laquo;</span>'+
			'</a>'+
		'</li>';
	}
	for (var i=page_from;i<=page_to;i++){
		if (i==page){
			html += '<li class="page-item active"><a class="page-link" href="#">'+i+'</a></li>';
		}else if (i==1){
			html += '<li class="page-item"><a class="page-link" href="javascript:list('+i+');">'+i+'</a></li>';
		}else{
			html += '<li class="page-item"><a class="page-link" href="javascript:list('+i+');">'+i+'</a></li>';
		}
	}
	if (page_from > 1){
		html += '<li class="page-item">'+
		'<a class="page-link" href="#" aria-label="Next">'+
		  '<span aria-hidden="true">&raquo;</span>'+
		'</a>'+
	  '</li>';
	}
    html += '</ul></nav>';
    return html;
}
function alert_danger(msg){
	if($('#alert')){
		$('#alert').text(msg);
		$('#alert').addClass("alert alert-danger");
		// close会删掉alert
		// $('#alert').append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
	}
}
Date.prototype.Format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
function logout(){
	Cookies.remove('session');
	window.location.reload();
}
function oauth_error(res){
	if(res && res.status==401){
		logout();
		alert(res["detail"]);
	}else{
		alert("服务器错误，请稍后再试");
	}
}

var api_path = "/api";

function require_login(callback){
	var session = Cookies.get('session');
	if(!session){
		$(location).prop('href', '/profile/login?goto='+window.location.pathname);
	}else{
		$.ajax({
			type: "GET",
			url: api_path + "/user/status",
			contentType: "application/json",
			success:function (res) {
				if(!res||!res["success"]){
					$(location).prop('href', '/profile/login?goto='+window.location.pathname);
				}else{
					callback();
				}
			},
			error: oauth_error
		});
	}
}
