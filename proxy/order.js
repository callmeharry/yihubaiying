/**
 * Created by Megas on 2014/12/9.
 * 与order model对应，用于提供数据
 */

var models = require('../models');
var Order = models.Order;

exports.newAndSaveOrder = function (hospitalId, departmentId, doctorId, userId, date, time, callback) {
    var order = new Order();
    order.hospital_id = hospitalId;
    order.dept_id = departmentId;
    order.doctor_id = doctorId;
    order.user_id = userId;
    order.order_date = date;
    order.order_time = time;
    order.save(callback);
};
