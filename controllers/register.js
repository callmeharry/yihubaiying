/**
 * Created by steve on 14-12-4.
 * yihubaiying register page
 */

var user = require('../proxy/user')
var randomNum;
exports.showRegister = function (req, res){
    console.log('mobile_register');
    res.render('mobile/mRegister');
}

exports.generateAuthCode = function () {
    randomNum = "";
    for (var i = 0; i < 6; i++) {
        randomNum += Math.floor(Math.random() * 10);
    }
    console.log(randomNum);
}
exports.doRegister = function(req, res, next) {
    var phoneNumber = req.body.mobile;
    var socialNumber = req.body.social_number;
    var password = req.body.password;
    var city = req.body.city;
    var name = req.body.name;
    var authCode = req.body.auth_code;
    if (!(authCode == randomNum)) {
        res.send('error_auth_code');
        return;
    }
    user.getOneUserByPhoneNumber(phoneNumber, function (err, users) {
        if (users != null) {
            res.send('Used phone number.');
            return;
        }
        user.newAndSave(phoneNumber, socialNumber, password, city, name, function (err) {
            if (err) {
                res.send(err.message);
                return;
            }
            // 发送激活邮件
            res.send('register success');
        });
    });
}

