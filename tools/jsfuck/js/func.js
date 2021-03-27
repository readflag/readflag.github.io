function $(id){
    return document.getElementById(id);
}
function encode(){
    var output = JSFuck.encode($("input").value, $("eval").checked, $("scope").checked);
    $("output").value = output;
    $("stats").innerHTML = output.length + " chars";
}
$("encode").onclick = encode;
$("eval").onchange = encode;
$("scope").onchange = encode;
encode();
$("run").onclick = function(){
    value = eval($("output").value);
    if (!$("eval").checked){
    alert('"' + value + '"');
    }
    return false;
};