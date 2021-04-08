var event_list;
$(function (){
    var session = Cookies.get('session');
    if(!session){
        $(location).prop('href', '/profile/login?goto='+window.location.pathname);
    }else{
        $.ajax({
            type: "POST",
            url: api_path + "/events/recent",
            contentType: "application/json",
            success:function (res) {
                if(res && res["success"]){
                    event_list = res["data"]["result"];
                }else{
                    console.log(res["msg"]);
                }
            }
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
        url: api_path + "/events/upsert",
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