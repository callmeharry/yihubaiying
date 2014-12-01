window.onload=function()//用window的onload事件，窗体加载完毕的时候
{
   var sbtitle=document.getElementById("hosInfoManage");
   sbtitle.style.display="inline";
   var sbtitle=document.getElementById("hosInfo");
   sbtitle.style.display="inline";
}

function btfunc(btn) {
	if(btn.innerHTML == "禁用")
		btn.innerHTML = "启用";
	else
		btn.innerHTML = "禁用";
}