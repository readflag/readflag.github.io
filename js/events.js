function load_events_items(data){
    $("#contents").html("");
    var html = '<div class="row">';
    $.each(data["result"], function (i, item) {
        var link = item["link"]?'<a href="'+item["link"]+'?fr=readflag" target="_blank">'+item["name"]+'</a>':'';
        var event_status = "secondary";
        if(item["status"]==0){
            event_status = "info";
        }else if(item["status"]==1){
            event_status = "warning";
        }else if(item["status"]==2){
            event_status = "danger";
        }else if(item["status"]==3){
            event_status = "success";
        }
        html += '<div class="col-sm-3">'+
        '<div class="card border-'+event_status+' mb-3" style="max-width: 16rem;">'+
            '<div class="card-header bg-transparent border-'+event_status+'">'+link+'</div>'+
            '<div class="card-body text-'+event_status+'">'+
                '<p class="card-text"><label>比赛类型：</label>'+item["type"]+'</p>'+
                '<p class="card-text"><label>报名开始：</label>'+item["bmks"]+'</p>'+
                '<p class="card-text"><label>报名截止：</label>'+item["bmjz"]+'</p>'+
                '<p class="card-text"><label>比赛开始：</label>'+item["bsks"]+'</p>'+
                '<p class="card-text"><label>比赛结束：</label>'+item["bsjs"]+'</p>'+
            '</div>'+
            '<div class="card-footer bg-transparent border-'+event_status+'"><a data-id="'+item["id"]+'" data-toggle="modal" data-target="#staticBackdrop">更多信息</a></div>'+
        '</div></div>';
    });
    html += '</div>';
    $("#contents").append(html);
    $("#contents").append(page_html(data["total"],data["size"],data["page"]));
}
function list(page){
    page = page?'?page='+page:'';
    $.ajax({
		type: "POST",
        url: api_path + "/events/list" + page,
		contentType: "application/json",
		success:function (res) {
			if(res && res["success"]){
				load_events_items(res["data"]);
			}else{
				console.log(res["msg"]);
			}
		}
    });
    window.scrollTo(0,0);
}
$(function (){
    list();
    $('#staticBackdrop').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var data_id = button.data('id') // Extract info from data-* attributes
        $.ajax({
            type: "POST",
            url: api_path + "/events/list?id=" + data_id,
            contentType: "application/json",
            success:function (res) {
                if(res && res["success"]){
                    var data = res["data"];
                    $("#ename").text(data["name"]);
                    $("#elink").text(data["link"]);
                    $("#etype").text(data["type"]);
                    if(data["bmks"])
                    $("#ebmks").text(new Date(data["bmks"]).Format("yyyy年MM月dd日 hh:mm:ss"));
                    if(data["bmjz"])
                    $("#ebmjz").text(new Date(data["bmjz"]).Format("yyyy年MM月dd日 hh:mm:ss"));
                    if(data["bsks"])
                    $("#ebsks").text(new Date(data["bsks"]).Format("yyyy年MM月dd日 hh:mm:ss"));
                    if(data["bsjs"])
                    $("#ebsjs").text(new Date(data["bsjs"]).Format("yyyy年MM月dd日 hh:mm:ss"));
                    $("#emore").html(data["readmore"]);
                }else{
                    console.log(res);
                }
            }
        });
    });
});