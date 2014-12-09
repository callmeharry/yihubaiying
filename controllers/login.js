/**
 * Created by Megas on 2014/12/2.
 * yihubaiying login page
 */

var config = require('../config');
var user = require('../proxy/user');
var authMiddleWare = require('../middlewares/auth');
var randomNumLogin  = ""; // auth code

/**
 * 显示用户登录页面
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
exports.showLogin = function (req, res) {
    console.log('mobile_login');
    res.render('mobile/mLogin');
};

/**
 * 获取验证码
 */
exports.getAuthCode = function (req, res) {
    //authMiddleWare.genAuthCode();
    for (var i = 0; i < 6; ++i) {
        randomNumLogin += Math.floor(Math.random() * 10);
    }
    console.log(randomNumLogin);
};

/**
 * 处理用户登录
 *
 * @param {HttpRequest} req
* @param {HttpResponse} res
* @param {Function} next
* @returns {*|String}
*/
exports.handleLogin = function (req, res, next) {
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.passWord;
    var authCode = req.body.auth_code;
    console.log(phoneNumber+" "+password+" "+authCode+" "+randomNumLogin);

    if (authCode != randomNumLogin) {
        res.send('error_auth_code');
        return;
    }

    // 交给前端验证
    //if (!phoneNumber || !password) {
    //    res.status(422);
    //    return res.render('mobile/mLogin', {error: '手机号或密码不能为空'});
    //}

    user.getOneUserByPhoneNumber(phoneNumber, function (err, userl) {
        if ( userl == null ) {
            res.send('user does not exist.');
            return;
        }
        user.getOneUserByPhoneNumberAndPassword(phoneNumber, password, function (err) {
            if(err) {
                res.send(err.message);
                return;
            }
            console.log('login success');
            return res.redirect('/mobile');
        });
    });
};



