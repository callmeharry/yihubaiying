/**
 * Created by Megas on 2014/12/2.
 * 身份验证
 */

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var config = require('../config');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy').User;

/**
 * 需要用户登录
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @constructor
 */
exports.UserRequired = function (req, res, next) {
    if (!req.session || !req.sessionID.user) {
        return res.status(403).send('您还未登录');
    }
    next();
};

//屏蔽用户blockUser

/**
 * 生成cookie
 * @param user
 * @param res
 * @constructor
 */
exports.GenSession = function GenSession(user, res) {
    // $$$$分隔信息
    var authToken = user._id + '$$$$';
    res.cookie(config.auth_cookie_name, authToken,
        // cookie有效期30天
        {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true});
};

exports.AuthUser = function (req, res, next) {
    var ep = new eventproxy();
    ep.fail();

    if (config.debug && req.cookies['mock_user']) {
        var mockUser = JSON.parse(req.cookies['mock_user']);
        req.session.user = new UserModel(mockUser);
        return next();
    }

    ep.all('get_user', function (user) {
        if (!user) {
            return next();
        }
        user = res.locals.current_user = req.session.user = new UserModel(user);
    });

    if (req.session.user) {
        ep.emit('get_user', req.session.user);
    } else {
        var authToken = req.signedCookies[config.auth_cookie_name];
        if (!authToken) {
            return next();
        }

        var auth = authToken.split('$$$$');
        var userPhoneNumber = auth[0];
        UserProxy.getUsersByPhoneNumber(userPhoneNumber, ep.done('get_user'));
    }
};











