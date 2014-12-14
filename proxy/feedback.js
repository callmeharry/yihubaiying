/**
 * Created by root on 14-12-14.
 */

var models = require("../models");
var Feedback = models.Feedback;
var tools = require('../middlewares/tool');
var eventproxy = require('eventproxy');
var User = require('./user');
var Hospital = require('./hospital');

exports.getFeedbackByQuery = function (query, opt, callback) {
    Feedback.find(query, '', opt, function (err, feedback) {
        if (err) {
            callback(err);
        }

        var proxy = new eventproxy();
        proxy.after('update', feedback.length, function () {
            callback(null, feedback);
        });

        if (query.fdType === 1) {
            //userFeedback
            for (var j = 0; j < feedback.length; j++) {
                (function (i) {
                    var user_id = feedback[i].sender_id;
                    User.getUserById(user_id, function (err, user) {
                        if (err) callback(err);

                        feedback[i].name = user.real_name;
                        feedback[i].date = tools.formatDate(feedback.date, true);
                        return proxy.emit('update');
                    });
                })(j);
            }

        } else {
            //hospital feedback
            for (var j = 0; j < feedback.length; j++) {
                (function (i) {
                    var hos_id = feedback[i].sender_id;
                    Hospital.getHospitalsByHospitalId(hos_id, function (err, hos) {
                        if (err) callback(err);

                        feedback[i].name = hos.hospital_name;
                        feedback[i].date = tools.formatDate(feedback.date, true);
                        proxy.emit('update');
                    });
                })(j);
            }

        }

    });
};

exports.getCountByQuery = function (query, callback) {
    Feedback.count(query, callback);
};