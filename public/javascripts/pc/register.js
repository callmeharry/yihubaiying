function checkAgree ()
{
	// body...
	if (document.getElementById('register-Agree').checked == true)
	{
		document.getElementById('register-submit').disabled = "";
	}
	else
	{
		document.getElementById('register-submit').disabled = "disabled";
	}
}
function checkSubmit ()
{
	// body...
	var password = document.getElementById('register-Password').value;
	var confirmPassword = document.getElementById('register-confirmPassword').value;
	if (password == confirmPassword)
	{
		return true;
	}
	else
	{
		alert("两次密码不一样，请重新输入！");
		return false;
	}
}