var dic={'aaaaa':'A','aaaab':'B','aaaba':'C','aaabb':'D','aabaa':'E','aabab':'F','aabba':'G','aabbb':'H','abaaa':'I','abaab':'J','ababa':'K','ababb':'L','abbaa':'M','abbab':'N','abbba':'O','abbbb':'P','baaaa':'Q','baaab':'R','baaba':'S','baabb':'T','babaa':'U','babab':'V','babba':'W','babbb':'X','bbaaa':'Y','bbaab':'Z'}
function jiemi()
{
    var str=document.getElementById("text1").value.toLocaleLowerCase();
    var ans=new String;
    for(var i=0;i<str.length;i+=5)
    {
        if(dic[str.slice(i,i+5)]){
            ans+=dic[str.slice(i,i+5)]
        }else{
            ans+="?"
        }
    }
    ans+='\n'+ans.toLocaleLowerCase();
    document.getElementById("text1").value=ans;
}
function jiami()
{
    var str=document.getElementById("text1").value.toLocaleUpperCase();
    var ans=new String
    for (var i=0;i<str.length;i++)
    {
        if(findKey(str[i])){
            ans+=findKey(str[i]);
        }else{
            ans+="?"
        }
    }
    ans+='\n'+ans.toUpperCase();
    document.getElementById("text1").value=ans;
}
function findKey(val)
{
    for (i in dic)
        if(dic[i]==val)
            return i;
}