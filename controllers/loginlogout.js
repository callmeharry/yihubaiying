/**
 * Created by Megas on 2014/12/2.
 * yihubaiying login page
 */

var config = require('../config');
var User = require('../proxy/user');
var authMiddleWare = require('../middlewares/auth');
var tool = require('../middlewares/tool');
var randomNumLogin = ""; // auth code

/**
 * 显示用户登录页面
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
exports.showLogin = function (req, res) {
    var url = req.query.previouspage;
    var url2 = req.url;
    console.log(url2);
    console.log('mobile_login');
    if (tool.getDeviceType(req.url))
        res.render('mobile/mLogin', {previousurl: url,title: '医呼百应:登录', error:''});
    else
        res.render('pc/login', {previousurl: url, error:''});
};

/**
 * 获取验证码
 */


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
    var realAuthCode = global.authCode;
    console.log(phoneNumber + " " + password + " " + authCode + " " + randomNumLogin);

    if (authCode != realAuthCode) {
        if (!tool.getDeviceType(req.url)) {
            res.render('pc/login', {previousurl: url, error: '验证码错误'});
        } else {
            res.render('mobile/mLogin', {
                previousurl: url,
                title: '医呼百应:登录',
                error: '验证码错误'
            });
        }
    }

    // 交给前端验证
    //if (!phoneNumber || !password) {
    //    res.status(422);
    //    return res.render('mobile/mLogin', {error: '手机号或密码不能为空'});
    //}
    User.getOneUserByPhoneNumber(phoneNumber, function (err, user) {
        if (user == null) {
            if (!tool.getDeviceType(req.url)) {
                res.render('pc/login', {previousurl: url,error: '此手机号未被注册'});
            } else {
                res.render('mobile/mLogin', {
                    title: '医呼百应:登录',
                    error: '此手机号未被注册'
                });
            }
        }
        User.getOneUserByPhoneNumberAndPassword(phoneNumber, password, function (err, verifiedUser) {
            if (err) {
                res.send(err.message);
                return;
            }
            if (!verifiedUser) {
                if (!tool.getDeviceType(req.url)) {
                    res.render('pc/login', {previousurl: url,error: '用户名与密码不匹配'});
                } else {
                    res.render('mobile/mLogin', {
                        previousurl: url,
                        title: '医呼百应:登录',
                        error: '用户名与密码不匹配'
                    });
                }
                return;
            }
            //authMiddleWare.genSession(verifiedUser,res);
            console.log('login success');
            authMiddleWare.genSession(verifiedUser, req, res);
            //redirect the page to the previous page of the login page
            var url = req.cookies.current_page;
            console.log(url);
            console.log(req.url);
            if (!url)
                if (tool.getDeviceType(req.url))
                    return res.redirect('/mobile');
                else
                    return res.redirect('/');
            else
                return res.redirect(url);
        });
    });
};


exports.handleLogout = function (req, res) {
    res.clearCookie(config.auth_cookie_userid, {path: '/'});
    res.clearCookie(config.auth_cookie_username, {path: '/'});
    res.clearCookie(config.auth_cookie_city, {path: '/'});
    req.session.destroy();
    if (tool.getDeviceType(req.url))
        res.redirect('/mobile');
    else
        res.redirect('/');
};
