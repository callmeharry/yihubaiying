var xmlHttp;
var remainingTime = 60;
function requestAuthCode(button) {
    time(button);
    xmlHttp = GetXmlHttpObject();

    var url = "/mobile/generateAuthCodeL";
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