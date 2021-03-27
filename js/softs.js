function load_softs_items(data){
    $("#contents").html("");
    var html = '<div class="row">';
    $.each(data["result"], function (i, item) {
		html += '<div class="col-xs-1-5">'+
		'<div class="card border-primary mb-3" style="width: 13rem;min-height: 8.5rem;">'+
			'<div class="card-body">'+
				'<h5 class="card-title"><a href="'+item["url"]+'?fr=readflag" target="_blank" title="'+item["name"]+'">'+item["name"]+'</a></h5>'+
				'<h6 class="card-subtitle mb-2 text-muted">'+item["desc"]+'</h6>'+
			'</div>'+
		'</div></div>';
	});
	html += '</div>';
    $("#contents").append(html);
    $("#contents").append(page_html(data["total"],data["size"],data["page"]));
}
function list(page){
    page = page?'?page='+page:'';
    var session = Cookies.get('session');
    if(!session){
        $(location).prop('href', '/profile/login?goto='+window.location.pathname);
    }else{
        $.ajax({
            type: "POST",
            url: api_path + "/softs/list" + page,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({'keyword': $("input[type='search']").val()}),
            success:function (res) {
                if(res && res["success"]){
                    load_softs_items(res["data"]);
                }else{
                    console.log(res["msg"]);
                }
            }
        });
        window.scrollTo(0,0);
    }
}
$(function (){
    list();
});