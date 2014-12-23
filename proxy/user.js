/**
 * Created by Megas on 2014/12/2.
 * 与user model对应,用于提供数据
 */

var models = require('../models');
var User = models.User;

/**
 * 根据用户名列表查找用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 * @returns {*}
 */
//exports.getUsersByPhoneNumber = function (phoneNumber, callback) {
//    if (phoneNumber.length === 0) {
//        return callback(null, []);
//    }
//    User.find({ phone_number: { $in: phoneNumber }}, callback);
//};

exports.getOneUserByPhoneNumber = function (phoneNumber, callback) {
    User.findOne({phone_number: phoneNumber}, callback);
};

exports.newAndSave = function (mobileNumber, socialNumber, password, city, name, callback) {
    var user = new User();
    user.phone_number = mobileNumber;
    user.social_number = socialNumber;
    user.password = password;
    user.user_state = city;
    user.real_name = name;
    user.save(callback);
};

exports.getOneUserByPhoneNumberAndPassword = function (phoneNumber, password, callback) {
    User.findOne({phone_number: phoneNumber, password: password}, callback);
};


exports.getUserByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
};

exports.getCountByQuery = function (query, callback) {
    User.count(query, callback);

};


exports.updateByQuery = function (query, opt, callback) {
    User.update(query, opt, callback);

};

exports.getUserById = function (id, callback) {
    User.findOne({_id: id}, callback);
};

exports.dropUser = function (query, callback) {

    User.remove(query, callback);
};

