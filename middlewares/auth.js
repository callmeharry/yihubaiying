/**
 * Created by Megas on 2014/12/2.
 * 身份验证
 */

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var config = require('../config');
var eventproxy = require('eventproxy');
var UserProxy = require('../proxy/user');

/**
 * 需要用户登录
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @constructor
 */
exports.UserRequired = function (req, res, next) {
    if (!req.session || !req.session.user_id) {
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

/**
 * 生成六位验证码
 * @constructor
 */
exports.genAuthCode = function GenerateAuthCode() {
    var randomNum = "";
    for (var i = 0; i < 6; ++i) {
        randomNum += Math.floor(Math.random() * 10);
    }
    console.log(randomNum);
};










