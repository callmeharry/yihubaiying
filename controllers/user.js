/**
 * Created by root on 14-12-17.
 */


var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy').User;
var Order = require('../proxy').Order;
var Feedback = require('../proxy').Feedback;
var validator = require('validator');

exports.showPersonInfo = function (req, res, next) {
    var user = req.session.user;



    User.getUserById(user._id, function (err,user) {
        if(err) return next(err);
        console.log(user+"hehe!");
        res.render('pc/personal_info', {user: user});
    });
};

exports.changepassword = function (req, res, next) {
    var old_password = validator.trim(req.body.old_password);
    var new_password = validator.trim(req.body.new_password);
    var user_id = res.cookies.user_id;

    User.getUserById(user_id, function (user) {
        if (user.password !== old_password)
            return res.render('pc/modify_password', {error: "old password is not correct!"});
        user.password = new_password;
        user.save(function (err) {
            if (err) return next(err);
            return res.redirect('/personInfo');
        });

    });
};

exports.changeCity = function (req, res, next) {
    var user_id = res.cookies.user_id;
    var newCity = validator.trim(req.body.newCity);

    User.getUserById(user_id, function (user) {
        user.address = newCity;
        user.save(function (err) {
            if (err) return res.send({status: -1, msg: "failed"});

            return res.send({status: 0});
        });
    });
};

exports.changePhoneNumber = function (req, res, next) {
    var current_user = req.session.user;
    var newPhoneNumber = req.body.newPhoneNumber || '';

    if (newPhoneNumber !== '')
        return res.send({status: -1, msg: "failed"});

    User.getUserById(current_user._id, function (user) {
        user.phone_number = newPhoneNumber;
        user.save(function (err) {
            if (err) return res.send({status: -1, msg: "failed"});

            return res.send({status: 0});
        });
    });

};

exports.changeEmail = function (req, res, next) {
    var user = req.session.user;
    var newEmail = validator(req.body.newEmail)||'';

    if (newEmail !== '')
        res.send({status: 0, msg: "can not be null"});

    User.getUserById(user._id, function (user) {
        user.email = newEmail;
        user.save(function (err) {
            if (err) return res.send({status: 0, msg: "can not be null"});

            res.send({status: 0});
        });

    });
};

/**
 * get user all orders
 * @param req
 * @param res
 * @param next
 */
exports.showMyOrder = function (req, res, next) {
    var user_id = res.cookies.user_id;

    var proxy = new eventproxy();
    proxy.fail(next);

    Order.getOrderByQuery({user_id: user_id}, {sort: "-order_time"}, proxy.done('orders', function (orders) {
        return orders;
    }));

    proxy.all('orders', function (orders) {
        return res.render('pc/my_order', orders);
    });
};

/**
 * this function need to recode, to confirm where to store hospital photos and
 * query the total attribute of functions
 * @param req
 * @param res
 * @param next
 */

exports.showFavorite = function (req, res, next) {
    var user_id = res.cookies.user_id;
    var proxy = new eventproxy;
    proxy.fail(next);

    User.getUserById(user_id, proxy.done('user', function (user) {
        return user;
    }));

    proxy.all('user', function (user) {
        res.render('pc/my_favorite', {
            favorite_hospital: user.favourite_hospital,
            favorite_doctor: user.favourite_doctor
        });
    });

};

exports.submitFeedback = function (req, res, next) {
    var content = validator.trim(req.body.content);
    var user_id = res.cookies.user_id;

    Feedback.newAndSave(content, 1, user_id, function (err) {
        if (err) next(err);

        res.send({status: 0});
    });

}

//Ajax interface for order operation

exports.judgeOrder = function (req, res, next) {
    var user_id = res.cookies.user_id;
    var order_id = req.body.order_id;
    var good_or_bad = req.body.good_or_bad;  // type  boolean
    var content = validator.trim(req.body.content);

    Order.addComment(order_id, good_or_bad, content, function (err) {
        if (err) return next(err);

        res.send({status: 0});
    });
};


exports.dropOrder = function (req, res, next) {
    var order_id = req.body.order_id;

    Order.dropOrder({_id: order_id}, function (err) {
        if (err) return next(err);
        res.send({status: 0});
    });

};

