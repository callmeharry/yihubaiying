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
    if (username == null)
        username = "undefined";
    console.log("logged " + req.cookies.username);
    if (url.indexOf('mobile') > 0)
        res.render('mobile/mIndex', {username: username});
    else
        res.render('pc/index', {username: username});
};