/**
 * Created by steve on 14-12-4.
 * yihubaiying register page
 */

var user = require('../proxy/user');
var randomNum = "";// 验证码

/**
 * 显示注册页面
 * @param req
 * @param res
 */
exports.showRegister = function (req, res) {
    console.log('mobile register');
    res.render('mobile/mRegister');
};

/**
 * 获取验证码
 */
exports.getAuthCode = function (req, res) {
    //authMiddleWare.genAuthCode();
    randomNum = '';
    for (var i = 0; i < 6; ++i) {
        randomNum += Math.floor(Math.random() * 10);
    }
    console.log(randomNum);
};

exports.handleRegister = function (req, res, next) {
    var phoneNumber = req.body.phoneNumber;
    var socialNumber = req.body.social_number;
    var password = req.body.password;
    var city = req.body.city;
    var name = req.body.name;
    var authCode = req.body.auth_code;
    console.log(phoneNumber);
    if (!(authCode == randomNum)) {
        res.send('error_auth_code');
        return;
    }
    user.getOneUserByPhoneNumber(phoneNumber, function (err, users) {
        console.log(users);
        if (users != null) {
            res.send('Used phone number.');
            return;
        }
        user.newAndSave(phoneNumber, socialNumber, password, city, name, function (err) {
            if (err) {
                res.send(err.message);
                return;
            }
            return res.redirect('/mobile');
        });
    });
};

