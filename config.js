/**
 * Created by Megas on 2014/11/29.
 * 医呼百应 配置文件
 * Todo:待补充
 */

var path = require('path');

var debug = true;

var config = {
    //debug为true时，用于本地测试
    debug: true,

    //mongodb配置
    db: 'mongodb://127.0.0.1/yihubaiying',
    db_name: 'yihubaiying',

    auth_cookie_name: 'yihubaiying',

    // 程序运行的端口
    port: 3000,

    page_limit: 5
};

module.exports = config;
