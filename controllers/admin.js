/**
 * Created by root on 14-12-8.
 */

var validator = require('validator');
var eventproxy = require('eventproxy');
var Hospital = require('../proxy').Hospital;
/**
 * show Admin Login info
 * @param req
 * @param res
 */
exports.showAdminLogin = function (req, res) {
    res.render('administrator/adminLogin');
};

/**
 * login Admin page
 * @param req
 * @param res
 */
exports.adminLogin = function (req, res, next) {

    var name = validator.trim(req.body.name);
    var password = validator.trim(req.body.password);

    var ep = new eventproxy();
    ep.fail(next);

    ep.on('login_err', function (msg) {
        res.status(422);
        res.render('administrator/adminLogin', {error: msg, name: name, password: password});
    });

    if (!name || !password) {
        ep.emit('login_err', 'name or password is too short!');
        return;
    }

    if (name === 'admin' && password === '123') {


        /**
         Hospital.newHospital("beijingshi shenjingbing yiyuan","hehe shenjingbingyuan!",function(err){
            if(err){
                return next(err);
            }

            console.log("success! save in the Mongo");

        });
         **/


        res.redirect('/admin/index');
    } else {
        ep.emit('login_err', "username or password is wrong!");
        return;
    }


};

/**
 * show hospital info
 * @param req
 * @param res
 * @param next
 */
exports.hosInfo = function (req, res, next) {

    res.render('administrator/hosInfo');
};

/**
 * add hospital
 * @param req
 * @param res
 * @param next
 */
exports.addHos = function (req, res, next) {
    res.render('administrator/hosAdd');
};

/**
 * change hospitalinfo
 * @param req
 * @param res
 * @param next
 */
exports.changeHosInfo = function (req, res, next) {

    res.render('administrator/hosAlter');
};

exports.deptInfo = function (req, res, next) {
    res.render('administrator/deptInfo');
};


exports.docInfo = function (req, res, next) {
    res.render('administrator/docInfo');
};

exports.callInfo = function (req, res, next) {
    res.render('administrator/callInfo');

};

exports.userInfo = function (req, res, next) {
    res.render('administrator/userInfo');
};

exports.exceptionManage = function (req, res, next) {

    res.render('administrator/exceptionManage');
};

exports.hosFeedback = function (req, res, next) {

    res.render('administrator/hosFeedback.html');
};

exports.userFeedback = function (req, res, next) {
    res.render('administrator/userFeedback.html');
};






