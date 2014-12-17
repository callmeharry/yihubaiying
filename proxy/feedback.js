/**
 * Created by root on 14-12-14.
 */

var models = require("../models");
var Feedback = models.Feedback;
var tools = require('../middlewares/tool');
var eventproxy = require('eventproxy');
var User = require('./user');
var Hospital = require('./hospital');

exports.newAndSave = function (content, fdType, sender_id, callback) {
    var feedback = new Feedback();
    feedback.content = content;
    feedback.fdType = fdType;
    feedback.sender_id = sender_id;
    feedback.save(callback);
};


exports.getFeedbackByQuery = function (query, opt, callback) {
    Feedback.find(query, '', opt, function (err, feedback) {
        if (err) {
            callback(err);
        }

        var proxy = new eventproxy();
        var feedbacks = new Array();
        proxy.after('update', feedback.length, function () {

            callback(null, feedbacks);
        });

        if (query.fdType === 1) {
            //userFeedback
            for (var j = 0; j < feedback.length; j++) {
                (function (i) {
                    var user_id = feedback[i].sender_id;
                    User.getUserById(user_id, function (err, user) {
                        if (err) callback(err);

                        feedbacks.push({
                            name: user.real_name, date: tools.formatDate(feedback[i].date, true),
                            content: feedback[i].content, _id: feedback[i]._id, if_check: feedback[i].if_check,
                            check_message: feedback[i].check_message ? feedback[i].check_message : ''
                        });

                        console.log(feedbacks[i]);
                        return proxy.emit('update');
                    });
                })(j);
            }

        } else {
            //hospital feedback
            for (var j = 0; j < feedback.length; j++) {
                (function (i) {
                    var hos_id = feedback[i].sender_id;
                    Hospital.getHospitalByHospitalId(hos_id, function (err, hos) {
                        if (err) callback(err);

                        feedbacks.push({
                            name: user.real_name, date: tools.formatDate(feedback[i].date, true),
                            content: feedback[i].content, _id: feedback[i]._id, if_check: feedback[i].if_check,
                            check_message: feedback[i].check_message ? feedback[i].check_message : ''
                        });

                        return proxy.emit('update');
                    });
                })(j);
            }

        }

    });
};

exports.getCountByQuery = function (query, callback) {
    Feedback.count(query, callback);
};