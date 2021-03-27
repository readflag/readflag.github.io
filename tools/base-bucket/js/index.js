function basen(fun,auto){
    var session = Cookies.get('session');
    if(!session){
        $(location).prop('href', '/profile/login?goto='+window.location.pathname);
    }else if($("#message").val()){
        var base = $("input[name='base']:checked").val();
        var post_data = {'data': $("#message").val()};
        if(!!auto){
            post_data['auto'] = true;
        }else{
            post_data['res_format'] = $("input[name='res_format']:checked").val();
            if(base==32){
                post_data['alg'] = $("input[name='base32']:checked").val();
            }else if(base==58){
                post_data['alg'] = $("input[name='base58']:checked").val();
            }else if(base==62){
                post_data['alg'] = $("input[name='base62']:checked").val();
            }else if(base==85){
                post_data['alg'] = $("input[name='base85']:checked").val();
            }
            if($("#table").is(':visible')){
                post_data['table'] = $("#table").val();
            }
        }
        $.ajax({
            type: "POST",
            url: api_path + "/v1/base_all?fun="+fun+"&base="+base,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(post_data),
            success:function (res) {
                if(!res){
                    alert("服务器错误");
                }else if(res["success"]){
                    $("#baseMessage").val(res["data"]["result"]);
                }else if(res["msg"]){
                    alert(res["msg"]);
                }else{
                    console.log(res);
                    alert("未知错误");
                }
            }
        });
    }else{
        $("#baseMessage").val("");
    }
}
$(function (){
    require_login(function(){
        $("#panel").removeClass("d-none");
    });
    $("input[name='base']").each(function(){
        $(this).click(function(){
            var base = $(this).val();
            $("#table").val("");
            // 结果格式：16,32,36,58,62,64,85,91,92,100
            if(base==36){
                $("#res_str").addClass("d-none");$("#res_oct").removeClass("d-none");$("#res_hex").addClass("d-none");$("#res_oct input").click();
            }else if(base==62){
                $("#res_str").removeClass("d-none");$("#res_oct").removeClass("d-none");$("#res_hex").addClass("d-none");$("#res_str input").click();
            }else if(base==16||base==100){
                $("#res_str").removeClass("d-none");$("#res_oct").addClass("d-none");$("#res_hex").addClass("d-none");$("#res_str input").click();
            }else{
                // 16,32,58,64,85,91,92
                $("#res_str").removeClass("d-none");$("#res_oct").addClass("d-none");$("#res_hex").removeClass("d-none");$("#res_str input").click();
            }
            // 算法
            if(base==32){
                $(".b32").show();$(".b58").hide();$(".b62").hide();$(".b85").hide();$(".b32:first").click();
            }else if(base==58){
                $(".b32").hide();$(".b58").show();$(".b62").hide();$(".b85").hide();$(".b58:first").click();
            }else if(base==62){
                $(".b32").hide();$(".b58").hide();$(".b62").show();$(".b85").hide();$(".b62:first").click();
            }else if(base==85){
                $(".b32").hide();$(".b58").hide();$(".b62").hide();$(".b85").show();$(".b85:first").click();
            }else{
                $(".b32").hide();$(".b58").hide();$(".b62").hide();$(".b85").hide();
            }
            // 换表
            if(base==92||base==100){
                $("#table").hide();
            }else{
                $("#table").show();
            }
        });
    });
    $("input[name='res_format']").each(function(){
        $(this).click(function(){
            var base = $("input[name='base']:checked").val();
            if(base==62){
                if($(this).val()=="oct"){
                    $(".b62:first").click();
                    $(".b62:last").hide();
                }else{
                    $(".b62:first").click();
                    $(".b62:last").show();
                }
            }
        });
    });
    $("input[name='base32']").each(function(){
        $(this).click(function(){
            if($(this).val()=='rfc4648'){
                $("#table").show();
            }else{
                $("#table").hide();
            }
        });
    });
    $("input[name='base58']").each(function(){
        $(this).click(function(){
            if($(this).val()=='pure'){
                $("#table").show();
            }else{
                $("#table").hide();
            }
        });
    });
    $("input[name='base85']").each(function(){
        $(this).click(function(){
            if($(this).val()=='ascii85'){
                $("#table").show();
            }else{
                $("#table").hide();
            }
        });
    });
    $("#encode").click(function(){
        basen('encode');
    });
    $("#decode").click(function(){
        basen('decode');
    });
    $("#decode_auto").click(function(){
        basen('decode',true);
    });
});