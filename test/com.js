/**
 * Created by steve on 14-12-1.
 */
var util = require('util'),
    http = require('http'),
    url = require('url'),
    querystring = require('querystring');
var portfinder = require('portfinder');


exports.do =function(req,res){
    var porta;
    portfinder.getPort(function (err, port) {
        //
        // `port` is guarenteed to be a free port
        // in this scope.
        //
        porta = port;
        console.log(porta);
        var regUrl = "http://localhost:3000/pay";
        //var cookie = 'a=b;c=d;',
        //    mail = 'regUsername', pass = 'password', vcode='abcde';
        //var _regUrl = util.format(regUrl, 'id123455', 'param2');
        var mobilenumber = "13146014081";
        var post_data = querystring.stringify({
            "account" : "cf_calddlmehary",
            "password" : "zdacyf1zdacyf1",
            "mobile" : mobilenumber,
            "content" : "test"
        });
        var post_option = {
            host: "localhost",
            port: porta,
            path: regUrl,
            method: "POST",
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : post_data.length,
                //Cookie : cookie
            }
        }
        var post_req = http.request(post_option, function(res) {

            res.on('data', function (buffer) {
                console.log(buffer.toString());
            });
            post_req.write(post_data);
            post_req.end();
        });
        post_req.on('error',function(e){
            console.log('error:'+ e.message);
        });

    });

}



