/**
 * Created by Megas on 2014/12/2.
 * 与user model对应,用于和数据库交互
 */

var models = require('../models');
var User = models.User;
var utility = require('utility');

/**
 * 根据用户名列表查找用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 * @returns {*}
 */
exports.getUsersByPhoneNumber = function (phoneNumber, callback) {
    if (phoneNumber.length === 0) {
        return callback(null, []);
    }
    User.find({ phone_number: { $in: phoneNumber }}, callback);
};
