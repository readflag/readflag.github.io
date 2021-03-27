$(document).ready(function() {
    $("#btn-encode").on("click",function() {
    $("#obfuscated").val(function() {
        return $("#original").aaencode();
    });
    });
    $("#btn-decode").on("click",function() {
        $("#original").val("");
        var encodedText = $("#obfuscated").val();
        var evalPreamble = "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
        var decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
        var evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
        var decodePostamble = ") ());";
        encodedText = encodedText.replace(/^\s*/, "").replace(/\s*$/, "");
        if (/^\s*$/.test(encodedText)) {
            return "";
        }
        if (encodedText.lastIndexOf(evalPreamble) < 0) {
            throw new Error("Given code is not encoded as aaencode.");
        }
        if (encodedText.lastIndexOf(evalPostamble) != encodedText.length - evalPostamble.length) {
            throw new Error("Given code is not encoded as aaencode.");
        }
        var decodingScript = encodedText.replace(evalPreamble, decodePreamble).replace(evalPostamble, decodePostamble);
        $("#original").val(eval(decodingScript));
    });
});