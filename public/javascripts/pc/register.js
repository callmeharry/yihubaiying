function checkAgree ()
{
	// body...
	if (document.getElementById('register_Agree').checked == true)
	{
		document.getElementById('register_submit').disabled = "";
	}
	else
	{
		document.getElementById('register_submit').disabled = "disabled";
	}
}
function checkSubmit ()
{
	// body...
	var result_PasswordLength = showPasswordLengthWarning();
	var result_RepeatPassword = showRepeatPasswordWarning();
	var result_Phone = showPhoneWarning();
	if (result_Phone&&result_RepeatPassword&&result_PasswordLength)
	{
	 	return true;
	}
	else
	{
	 	alert ("请先修改错误，然后再提交注册！");
		return false;
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
function showRepeatPasswordWarning()
{
    element = document.getElementById('id_repeat_passWord').value;
    element1 = document.getElementById('id_passWord').value;

    if (element != element1)
    {
        //alert(document.getElementById("id_warning").innerHTML);
        document.getElementById('id_repeat_warning').style.display = "";
        return false;
    }
    else
    {
        document.getElementById('id_repeat_warning').style.display = "none";
        return true;
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
function commit()
{
    element1 = document.getElementById('id_idNumber').value;
    l1 = element1.length;
    if (l == 0)
    {
        document.getElementById('id_idNumber_warning').style.display = "";
    }
    else
    {
        element2 = document.getElementById('id_name').value;
        l2 = element2.length;
        if (l == 0)
        {
            document.getElementById('id_name_warning').style.display = "";
        }

    }
}
