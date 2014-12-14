/**
 * Created by steve on 14-12-1.
 * 短信相关
 */
var querystring = require('querystring')
    , http = require('http');

exports.registerVerify = function (req,res) {
    var mobilenumber = req.body.mobilenumber;
    var url = 'http://106.ihuyi.cn/';

    var data = querystring.stringify({
        account: 'callmeharry',
        password: 'zdacyf1zdacyf1',
        mobile: '13146014081',
        content: 'zzz'
    });
    var opt = {
        hostname: '106.ihuyi.cn',
        port: 80,
        path: '/webservice/sms.php?method=Submit',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };
    var post = http.request(opt, function (response) {
        response.on('data', function (data) {
            console.log(data.toString());
        });
    });
    post.on('error', function (e) {
        res.log('problem with request: ' + e.message);
        res.send(e.message);
    });
    post.write(data);
    post.end();
    res.send('success');
}
