/**
 * Created by steve on 14-12-14.
 * Tool file
 */
var moment = require('moment');
var config = require('../config');
moment.locale('zh-cn'); // 使用中文


exports.setCurrentPage = function (req, res) {//将当前页面记录在cookie中
    res.cookie(config.current_page, req.url, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30});
};
exports.getDeviceType = function (data) {//得到访问者所在的终端信息
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

exports.getDateByNum = function(num){
    var date = new Date();
    var new_date = new Date();
    new_date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * (Math.floor(num / 2 + 1)));
    return (new_date.getMonth() + 1) + '月' + (new_date.getDate()) + '日' + ' ';
};

exports.getAuthCode = function (req, res) {
    //authMiddleWare.genAuthCode();
    var randomNumLogin = '';
    for (var i = 0; i < 6; ++i) {
        randomNumLogin += Math.floor(Math.random() * 10);
    }
    console.log(randomNumLogin);
    global.authCode = randomNumLogin;
};