/**
 * Created by Megas on 2014/12/9.
 * 与order model对应，用于提供数据
 */

var models = require('../models');
var Order = models.Order;
var Hospital = require('../proxy/hospital');
var Doctor = require('../proxy/doctor');
var eventproxy = require('eventproxy');
var User = require('../proxy/user');

exports.newAndSaveOrder = function (hospitalId, departmentId, doctorId, userId, seeTime, dateNum, callback) {
    var proxy = new eventproxy();
    proxy.fail(callback);

    var order = new Order();
    order.hospital_id = hospitalId;
    order.dept_id = departmentId;
    order.doctor_id = doctorId;
    order.user_id = userId;
    order.order_time = new Date();
    order.order_see_time = seeTime;

    order.save(proxy.done(function(){
        proxy.emit("order");
    }));
    var today = new Date();
    var weekOfTomorrow = today.getDay() + 1;
    var index = (2*weekOfTomorrow+dateNum<14)?(2*weekOfTomorrow+dateNum):(2*weekOfTomorrow+dateNum-14);


    var ups = {"$inc":{"hospital_order_count":1}};
    Hospital.updateDeptByQuery({_id:hospitalId},ups,proxy.done(function(){
        proxy.emit('hospital');

    }));



    Doctor.getDoctorById(doctorId,function(err, doctor){
        if(err) return callback(err);
        console.log(dateNum);
        console.log(index);
        doctor.doctor_visit[index].leftSource = doctor.doctor_visit[index].leftSource -1;
        doctor.save(proxy.done(function(){
            proxy.emit('doctor');
        }));

    });

    proxy.all('doctor','hospital','order',function(){
        callback(null);
    });

};

exports.addComment = function (orderId, goodOrBad, content, callback) {
    Order.update({_id: orderId}, {
        "$set": {
            comment: {
                good_or_bad: goodOrBad,
                content: content
            }
        }
    }, callback);
};

exports.dropOrder = function (query, callback) {
    Order.remove(query, callback);
};

exports.getOrderByQuery = function (query, opt, callback) {
    Order.find(query, '', opt, function (err, orders) {
        if (err) callback(err, []);

        var proxy = new eventproxy();
        proxy.fail(callback);

        var fit_orders = new Array();

        proxy.after('updates', orders.length * 3, function () {
            return callback(null, fit_orders);
        });

        for (var j = 0; j < orders.length; j++) {
            (function (i) {
                var dept_id = orders[i].dept_id;
                var doctor_id = orders[i].doctor_id;
                var user_id = orders[i].user_id;
                fit_orders.push(orders[i]);

                Hospital.getDeptDoctors(dept_id, proxy.done(function (hospital) {
                    fit_orders[i].hospital_name = hospital.hospital_name;
                    fit_orders[i].dept_name = hospital.dept_name;
                    proxy.emit('updates');
                }));

                User.getUserById(user_id, proxy.done(function (user) {
                    fit_orders[i].real_name = user.real_name;
                    proxy.emit('updates');
                }));

                Doctor.getDoctorById(doctor_id, proxy.done(function (doctor) {
                    fit_orders[i].doctor_name = doctor.doctor_name;
                    proxy.emit('updates');
                }));

            })(j);
        }
    });
};
