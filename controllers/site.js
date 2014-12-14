/**
 * Created by steve on 14-12-8.
 * 医呼百应首页
 */

/**
 * 显示手机端首页
 * @param req
 * @param res
 */
exports.showIndex = function (req, res) {
    var url = req.url;
    if (url.indexOf('mobile') > 0)
        res.render('mobile/mIndex');
    else
        res.render('pc/index');
};