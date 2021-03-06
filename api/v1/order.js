/**
 * Created by Megas on 2014/12/19.
 */
var models = require('../../models');
var HospitalModel = models.Hospital;
var HospitalProxy = require('../../proxy').Hospital;
var DoctorProxy = require('../../proxy').Doctor;
var UserProxy = require('../../proxy').User;
var OrderProxy = require('../../proxy').Order;
var config = require('../../config');
var eventproxy = require('eventproxy');
var _ = require('lodash');

/**
 * 获得挂号单及挂号者信息
 * Todo:暂定根据手机号查询挂号者，需要在需求文档中注明
 * 对应用例YHBY-503
 * @param req
 * @param res
 * @param next
 */
var getOrderInfo = function (req, res, next) {
    var hosId = req.query.ak;
    var phoneNum = req.body.phone_number;

    UserProxy.getOneUserByPhoneNumber(phoneNum, function (err, user) {
        if (err) {
            res.send('该用户不存在');
        } else {
            var query = {'user_id': user._id, 'hospital_id': hosId};
            var opt = {'hospital_id': 0, 'dept_id': 0, 'user_id': 0};
            OrderProxy.getOrderByQuery(query, opt, function (err, orders) {
                if (err) {
                    res.send('查找订单信息时出错');
                } else {
                    res.send({orderInfo: orders});
                }
            });
        }
    });
};

exports.getOrderInfo = getOrderInfo;

/**
 * 供医院处理订单
 * 对应YHBY-504
 * @param req
 * @param res
 * @param next
 */
var confirmOrder = function (req, res, next) {
    var hosId = req.query.ak;
    var orderId = req.query.oID;

    HospitalProxy.getHospitalByHospitalId(hosId, function (err) {
        if (err) {
            return callback(err);
        } else {
            var query = {id: orderId};

            OrderProxy.getOrderByQuery(query, {}, function (err, order) {
                if (err) {
                    return res.send('处理订单时出错');
                } else {
                    order.update(query, {$set: {'order_if_finished': true}});
                    return res.send('订单号：'+OrderProxy._id+'\n'+OrderProxy.order_if_finished);
                }
            });
        }
    });
};

exports.confirmOrder = confirmOrder;