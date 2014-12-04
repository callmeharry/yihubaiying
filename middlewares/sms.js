/**
 * Created by steve on 14-12-1.
 * 短信相关
 */
var http = require('http');

exports.registerVerify = function (req,res) {
    var mobilenumber = req.body.mobilenumber;
    var url = 'http://106.ihuyi.cn/webservice/sms.php?method=Submit';

}
