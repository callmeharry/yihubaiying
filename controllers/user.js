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
        req.session.user = user;
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
            req.session.user = user;
            return tool.getDeviceType(req.url)==true ? res.redirect('/mobile/person/info'):res.redirect('/person/info');
        });

    });
};

exports.showChangeAddress = function(req, res, next){
    var user = req.session.user;

    if(tool.getDeviceType(req.url))
        res.render('mobile/mCityChange',{user:user});
    else
        res.render('pc/modify_address',{
        user:user
    });
};
exports.changeAddress = function (req, res, next) {
    var current_user = req.session.user;
    var newCity = validator.trim(req.body.newAddress)||'';

    if(newCity == '')
        newCity = "北京";
    console.log('test!');
    User.getUserById(current_user._id, function (err, user) {
        user.address = newCity;
        user.save(function (err) {
            if (err) return next(err);
            req.session.user = user;

            if(tool.getDeviceType(req.url))
                return res.redirect('/mobile/person/info');
            else
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

    if (newPhoneNumber == '')
    {
        if(tool.getDeviceType(req.url))
            return res.render('mobile/mPhoneNumberChange',{
                user:req.session.user,error:"the new phone number should not be none"});
        else
            return res.render('pc/modify_phonenumber',{
                user:req.session.user,error:"the new phone number should not be none"
            });

    }


    User.getUserById(current_user._id, function (err,user) {
        user.phone_number = newPhoneNumber;
        user.save(function (err) {
            if (err) next(err);
            req.session.user = user;
            if(tool.getDeviceType(req.url))
                res.redirect('/mobile/person/info');
            else
                res.redirect('/person/info');

        });
    });

};

exports.showChangeEmail = function(req, res, next){
    if(tool.getDeviceType(req.url))
        res.render('mobile/mChangeEmail',{
            user:req.session.user
        });
    else

        res.render('pc/modify_email',{
        user:req.session.user
    });
};


exports.changeEmail = function (req, res, next) {
    var user = req.session.user;
    var newEmail = validator.trim(req.body.newEmail)||'';
    console.log("test!");

    if (newEmail === '')
    {
        if(tool.getDeviceType(req.url))
            return  res.render('mobile/mChangeEmail',{user:user,
                    error:"the mail should not be null"});
        else
            return res.render('pc/modify_email',{
                user:user,
                error:"the mail should not be null"});
    }

    User.getUserById(user._id, function (err, user) {
        user.email = newEmail;
        user.save(function (errs) {
            if (errs) return next(err);
            req.session.user = user;
            if(tool.getDeviceType(req.url))
                res.redirect('/mobile/person/info');
            else
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

    User.getFavoritesByQuery(user._id, proxy.done('user', function (user) {
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
        if(tool.getDeviceType(req.url))
            res.render('mobile/mShortCodes',{
                user:user,
                feedback:feedbacks
            })
        res.render('pc/my_feedback',{
            feedback:feedbacks,
            user:user
        });

    });

};
exports.showsubmitFeedback = function(req, res, next){
    var user = req.session.user;
    if(tool.getDeviceType(req.url))
        res.render('mobile/mAskPage',{user:user});

    res.render('pc/feedback',{
        user:user
    });

}
exports.submitFeedback = function (req, res, next) {
    var content = validator.trim(req.body.content);
    var user =req.session.user;

    Feedback.newAndSave(content, 1, user._id, function (err) {
        if (err) next(err);

        if(tool.getDeviceType(req.url))
            res.redirect('/mobile/person/feedback');
        else
            res.redirect('/person/feedback');
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

exports.changeCity = function(req,res,next) {
    var city = req.cookies.city;
    console.log(1);
    res.render('mobile/mCityChange(2)',{title:"更改城市",currCity:city});
};
