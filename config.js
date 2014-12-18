/**
 * Created by Megas on 2014/11/29.
 * 医呼百应 配置文件
 * Todo:待补充
 */

var path = require('path');

var debug = true;

var config = {
    //debug为true时，用于本地测试

    //mongodb配置
    db: 'mongodb://127.0.0.1/yihubaiying',
    db_name: 'yihubaiying',
    current_page: 'current_page',
    auth_cookie_userid: 'user_id',
    auth_cookie_username: 'username',
    auth_cookie_city: 'city',
    auth_cookie_userid: null,

    session_secret: 'node_club_secret', //must change

    // 程序运行的端口
    port: 23333,

    page_limit: 5
};

module.exports = config;
