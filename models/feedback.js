/**
 * Created by root on 14-12-14.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
/**
 * fdType means 1: user, 2:hospital
 * @type {Schema}
 */
var FeedbackSchema = new Schema({
    content: {type: String},
    fdType: {type: Number},
    sender_id: {type: ObjectId},
    if_check: {type: Boolean, default: false},
    check_message: {type: String},
    date: {type: Date, default: Date.now}

});

FeedbackSchema.index({sender_id: 1, date: -1});

mongoose.model('Feedback', FeedbackSchema);
