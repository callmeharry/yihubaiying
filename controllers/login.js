/**
 * Created by Megas on 2014/12/2.
 * 用户登录
 */

var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var utility = require('utility');
var authMiddleWare = require('../middleware/auth');

/**
 * 显示用户登录页面
 * @param {HttpRequest} req
 * @param {HttpRespomse} res
 */
exports.showLogin = function (req, res) {
    req.session._loginReferer = req.headers.referer;
    res.render('mobile/mLogin');
};

//var notJump = [
//    '/active_account',
//    '/reset_pass',
//    '/signup',
//    '/search_pas'
//];

/**
 * 处理用户登录
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 * @returns {*|String}
 */
exports.login = function (req, res, next) {
    // ?
    var phoneNumber = validator.trim(req.body.name).toLowerCase();
    var password = validator.trim(req.body.password);

    var eventProxy = new eventproxy();
    eventproxy.fail(next);

    if (!phoneNumber || !password) {
        res.status(422);
        return res.render('mobile/mLogin', {error: '手机号或密码不能为空'});
    }

    var getUser;
    // ?
    if (phoneNumber.indexOf('@') !== -1) {
        getUser = User.getUsersByNames;
    }

    ep.on('login_error', function (login_error) {
        res.status(403);
        res.render('mobile/mLogin', {error: '手机号或密码错误'});
    });

    getUser(phoneNumber, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return ep.emit('login_error');
        }
        var passHash = user.password;

    })
};



