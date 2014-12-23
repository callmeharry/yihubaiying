/**
 * Created by Megas on 2014/12/24.
 */
var models = require('../../models');
var UserProxy = models.User;
var HospitalModel = models.Hospital;
var HospitalProxy = require('../../proxy').Hospital;
var FeedBackProxy = require('../../proxy').Feedback;
var config = require('../../config');
var eventproxy = require('eventproxy');
var tools = require('../middlewares/tool');

/**
 * 医院获取未处理反馈
 * @param req
 * @param res
 * @param next
 */
var getFeedback = function (req, res, next) {
    var hosId = req.query.ak;
    var query = {'if_check': false, 'fdType': 1};

    FeedBackProxy.getFeedbackByQuery(query, {}, function (err, feedbacks) {
        for (var j = 0; j < feedbacks.length; j++) {
            (function (i) {
                var user_id = feedbacks[i].sender_id;
                UserProxy.getUserById(user_id, function (err, user) {
                    if (err) callback(err);
                    if(feedbacks[i].if_check == false)
                        feedbacks.push({
                            name: user.real_name, date: tools.formatDate(feedback[i].date, true),
                            content: feedbacks[i].content, _id: feedback[i]._id
                        });
                    console.log(feedbacks[i]);
                });
            })(j);
        }
    });
};

exports.getFeedback = getFeedback;

var sentFeedback = function (req, res, next) {
    var hosId = req.query.ak;
    var fbId = req.query.fbId;
    var ckms = req.body.message;

    FeedBackProxy.getFeedbackByQuery({_id: fbId}, {}, function (err, feedback) {
        feedback.update({'_id':fbId}, {$set: {
            fbType: 2,
            sender_id: hosId,
            if_check: true,
            check_message: ckms,
            date: Date.now
        }});
        return res.send('反馈已发送');
    });
};

exports.sendFeedback = sentFeedback;
