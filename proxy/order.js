/**
 * Created by Megas on 2014/12/9.
 * 与order model对应，用于提供数据
 */

var models = require('../models');
var Order = models.Order;

exports.newAndSaveOrder = function (hospitalId, departmentId, doctorId, userId, time, seeTime, callback) {
    var order = new Order();
    order.hospital_id = hospitalId;
    order.dept_id = departmentId;
    order.doctor_id = doctorId;
    order.user_id = userId;
    order.order_time = time;
    order.order_see_time = seeTime;
    order.save(callback);
};

exports.addComment = function (orderId, comTime, goodOrBad, content, callback) {
   Order.update({_id: orderId}, {$push: {comment: {
       time: comTime,
       good_or_bad: goodOrBad,
       content: content
   }}}, callback);
};
