var xmlHttp;
var remainingTime = 60;
function requestAuthCode(button) {
    time(button);
    xmlHttp = GetXmlHttpObject();

    var url = "/mobile/generateAuthCode";
    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();
    xmlHttp.onreadystatechange = getOkPost;
}

function time(button) {
    if (remainingTime == 0) {
        button.removeAttribute("disabled");
        button.innerHTML = "获取验证码";
        remainingTime = 60;
    } else {
        button.setAttribute("disabled", true);
        button.innerHTML = remainingTime + "秒后重新发送";
        remainingTime--;
        setTimeout(function () {
                    time(button)
                },
                1000);
    }
}

function GetXmlHttpObject() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

function getOkPost() {
    if (xmlHttp.readyState == 1 || xmlHttp.readyState == 2 || xmlHttp.readyState == 3) {
        // 本地提示：加载中/处理中

    }
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var d = xmlHttp.responseText; // 返回值
        // 处理返回值
    }
}
function checkSubmit()
{
	var result_PasswordLength = showPasswordLengthWarning();
	var result_Phone = showPhoneWarning();
	if (result_Phone&&result_PasswordLength)
	{
	 	return true;
	}
	else
	{
	 	alert ("请先修改错误，然后再提交注册！");
		return false;
	}

}
function showPhoneWarning()
{
    element = document.getElementById('id_phoneNumber').value;
    l = element.length;

    if (l != 11)
    {
        //alert(document.getElementById("id_warning").innerHTML);
        document.getElementById('id_phone_warning').style.display = "";
        return false;
    }
    else
    {
        document.getElementById('id_phone_warning').style.display = "none";
        return true;
    }
}
function showPasswordLengthWarning()
{
    element = document.getElementById('id_passWord').value;
    if (element.length > 20 || element.length < 6)
    {
        //alert(document.getElementById("id_warning").innerHTML);
        document.getElementById('id_warning').style.display = "";
        return false;
    }
    else
    {
        document.getElementById('id_warning').style.display = "none";
        return true;
    }
}
function showAuthCode(button)
{
	if (showPhoneWarning())
	{
		requestAuthCode(button);
	}
	else
	{
		alert("请先修改手机号格式！");
	}
}