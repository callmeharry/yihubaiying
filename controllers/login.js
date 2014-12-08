/**
 * Created by Megas on 2014/12/2.
 * yihubaiying login page
 */

var eventproxy = require('eventproxy');
var config = require('../config');
var user = require('../proxy/user');
var utility = require('utility');
var authMiddleWare = require('../middlewares/auth');

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
    authMiddleWare.genAuthCode();
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

    var phoneNumber = req.body.mobile;
    var password = req.body.password;
    var authCode = req.body.auth_code;

    if (!(authCode === randomNum)) {
        res.send('error_auth_code');
        return;
    }

    // 交给前端验证
    //if (!phoneNumber || !password) {
    //    res.status(422);
    //    return res.render('mobile/mLogin', {error: '手机号或密码不能为空'});
    //}

    user.getOneUserByPhoneNumber(phoneNumber, function (err, user) {
        if ( user == null ) {
            res.send('user does not exist.');
            return;
        }
        user.getOneUserByPhoneNumberAndPassword(phoneNumber, password, function (err) {
            if(err) {
                res.send(err.message);
                return;
            }
        });
    });
};



