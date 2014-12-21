/**
 * Created by root on 14-12-17.
 */


var validator = require('validator');
var eventproxy = require('eventproxy');
var User = require('../proxy').User;
var Order = require('../proxy').Order;
var Feedback = require('../proxy').Feedback;
var validator = require('validator');
var tool = require('../middlewares/tool');

exports.showPersonInfo = function (req, res, next) {
    var user = req.session.user;
    console.log("hehe");


    User.getUserById(user._id, function (err,user) {
        if(err) return next(err);
        res.render('pc/personal_info', {user: user,
            register_time:tool.formatDate(user.register_time)});
    });
};

exports.showchangePass = function(req,res,next){
    var user = req.session.user;
    return res.render('pc/modify_password',{user:user});
};

exports.changepassword = function (req, res, next) {
    var old_password = validator.trim(req.body.oldPassword);
    var new_password = validator.trim(req.body.newPassword);
    var current_user = req.session.user;
    User.getUserById(current_user._id, function (err,user) {
        if (user.password !== old_password)
            return res.render('pc/modify_password', {error: "old password is not correct!"});
        user.password = new_password;
        user.save(function (err) {
            if (err) return next(err);
            return res.redirect('/person/info');
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

exports.showChangePhone = function(req, res, next){
    res.render('pc/modify_phonenumber',{
        user:req.session.user
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

exports.showChangeEmail = function(req, res, next){
    res.render('pc/modify_email',{
        user:req.session.user
    });
};


exports.changeEmail = function (req, res, next) {
    var user = req.session.user;
    var newEmail = validator.trim(req.body.newEmail)||'';
    console.log("test!");

    if (newEmail === '')
        res.send('pc/modify_email',{error:"the mail should not be null"});
    console.log("shit!1");
    User.getUserById(user._id, function (err, user) {
        user.email = newEmail;
        console.log("shit!2");
        user.save(function (errs) {
            if (errs) return next(err);
            console.log("shit!");
            res.redirect('/person/info');
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
    var user = req.session.user;

    var proxy = new eventproxy();
    proxy.fail(next);

    Order.getOrderByQuery({user_id: user._id}, {sort: "-order_time"}, proxy.done('orders', function (orders) {
        return orders;
    }));

    proxy.all('orders', function (orders) {
        return res.render('pc/my_order', {
            orders:orders,
            user:user
        });
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
    var user = req.session.user;
    var proxy = new eventproxy;
    proxy.fail(next);

    User.getUserById(user._id, proxy.done('user', function (user) {
        return user;
    }));

    proxy.all('user', function (user) {
        res.render('pc/my_favourite', {
           user:user
        });
    });

};

exports.showFeedback=  function(req, res, next){
    var user = req.session.user;
    res.render('pc/feedback',{
        user:user
    });

}

exports.submitFeedback = function (req, res, next) {
    var content = validator.trim(req.body.content);
    var user =req.session.user;

    Feedback.newAndSave(content, 1, user._id, function (err) {
        if (err) next(err);

        res.redirect('/person/info');
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

