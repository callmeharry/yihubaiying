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
    console.log("hehe"+user);


    User.getUserById(user._id, function (err,user) {
        if(err) return next(err);
        var register_time = tool.formatDate(user.register_time);

        if(tool.getDeviceType(req.url))
            res.render('mobile/mAbout', {user: user,
                  register_time:register_time});
        else
            res.render('pc/personal_info', {user: user,
                register_time:register_time});
    });
};

exports.showchangePass = function(req,res,next){
    var user = req.session.user;
    if(tool.getDeviceType(req.url))
        return res.render('mobile/mPassWordChange',{user:user});
    else
        return res.render('pc/modify_password',{user:user});

};

exports.changepassword = function (req, res, next) {
    var old_password = validator.trim(req.body.oldPassword);
    var new_password = validator.trim(req.body.newPassword);
    var confirm_password = validator.trim(req.body.confirmPassword);
    var current_user = req.session.user;

    if(confirm_password != new_password)
    {
        console.log('test!');

        if(tool.getDeviceType(req.url))
            res.render('mobile/mPassWordChange',{error:"the new password is not the same!",
                user:current_user});
        else
        return res.render('pc/modify_password',{error:"the new password is not the same!",
            user:current_user});
    }

    User.getUserById(current_user._id, function (err,user) {
        if (user.password !== old_password)
        {
            if(tool.getDeviceType(req.url))
                return res.render('mobile/mPassWordChange',{error: "old password is not correct!",
                    user:current_user});
            else
                return res.render('pc/modify_password', {error: "old password is not correct!",
                user:current_user});
        }


        user.password = new_password;
        user.save(function (err) {
            if (err) return next(err);

            return tool.getDeviceType(req.url)==true ? res.redirect('/mobile/person/info'):res.redirect('/person/info');
        });

    });
};

exports.showChangeAddress = function(req, res, next){
    var user = req.session.user;
    res.render('pc/modify_address',{
        user:user
    });
};
exports.changeCity = function (req, res, next) {
    var current_user = res.session.user;
    var newCity = validator.trim(req.body.newAddress);

    User.getUserById(current_user._id, function (user) {
        user.address = newCity;
        user.save(function (err) {
            if (err) return next(err);

            return res.redirect('/person/info');
        });
    });
};

exports.showChangePhone = function(req, res, next){

    if(tool.getDeviceType(req.url))
        res.render('mobile/mPhoneNumberChange',{
            user:req.session.user});
    else
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

exports.getMyFeedbacks = function(req, res, next){
    var user = req.session.user;
    Feedback.getFeedbackByQuery({sender_id:user._id,fdType:1},{},function(err,feedbacks){
        if(err) return next(err);
        res.render('',{
            feedbacks:feedbacks
        });


    });



};


exports.showFeedback =  function(req, res, next){
    var user = req.session.user;
    var query= {sender_id:user._id,fdType:1}
    Feedback.getFeedbackByQuery(query,{},function(err, feedbacks){
        if(err) return next(err);

        res.render('pc/my_feedback',{
            feedback:feedbacks,
            user:user
        })

    });

};
exports.showsubmitFeedback = function(req, res, next){
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
