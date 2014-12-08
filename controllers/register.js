/**
 * Created by steve on 14-12-4.
 * yihubaiying register page
 */

var user = require('../proxy/user');
var randomNum;// auth code
exports.showRegister = function (req, res){
    console.log('mobile register');
    res.render('mobile/mRegister');
};

/**
 * 获取验证码
 */
exports.getAuthCode = function (req, res) {
    authMiddleWare.genAuthCode();
};

exports.handleRegister = function (req, res, next) {
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
            res.send('register success');
        });
    });
};

