/**
 * Created by steve on 14-12-1.
 * 短信测试类
 */
var http = require('http');
var querystring = require('querystring');

exports.registerVerity = function (req,res) {
    var mobilenumber = 13146014081;
    var url = 'http://localhost:3050';
    var post_data = querystring.stringify({
        "account" : "cf_calddlmehary",
        "password" : "zdacyf1zdacyf1",
        "mobile" : mobilenumber,
        "content" : "test"
    });
    var opt = {
        host: "localhost",
        port: 443,
        path: url,
        method: "POST",
        headers: {
            'Content-Type':"application/x-www-form-urlencoded",
            'Content-Length':post_data.length
        }
    };
    console.log('ready');
    var result = http.request(opt, function (serverFeedback) {
        console.log(serverFeedback.statusCode)
        if (serverFeedback.statusCode == 200) {
            var body = "";
            serverFeedback.on('data', function (data) { body += data; })
                .on('end', function () { res.send(200, body); });
        }
        else {
            res.send(500, "error");
        }
    });
    result.on('end',function(){
        console.log('complete');
    })
    result.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
}