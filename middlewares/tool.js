/**
 * Created by steve on 14-12-14.
 * Tool file
 */
var moment = require('moment');
var config = require('../config');
moment.locale('zh-cn'); // 使用中文


exports.setCurrentPage = function (req, res) {
    res.cookie(config.current_page, req.url, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30});
};
exports.getDeviceType = function (data) {
    if (data.indexOf('mobile') > 0)
        return true;//mobile
    else
        return false;//pc
};

// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};