/**
 * Created by steve on 14-12-8.
 * 医呼百应首页
 */

/**
 * 显示手机端首页
 * @param req
 * @param res
 */
var config = require('../config');
exports.showIndex = function (req, res) {
    res.clearCookie(config.current_page, {path: '/'});
    var url = req.url;
    var username = req.cookies.username;
    console.log("logged " + req.cookies.username);
    res.cookie(config.auth_cookie_city, '北京',
        // cookie有效期30天
        {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30});
    if (url.indexOf('mobile') > 0)
        res.render('mobile/mIndex', {username: username, title: '医呼百应:首页'});
    else
        res.render('pc/index', {username: username});
};