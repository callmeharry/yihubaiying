/**
 * Created by steve on 14-11-23.
 * Modified by Megas on 14-11-29.
 * Todo:未加索引
 */
/** 医呼百应 订单模型 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config');

var OrderSchema = new Schema({
    order_time: {type: Date, default: Date.now},
    order_see_time:{type:String},
    hospital_id: { type: ObjectId },
    dept_id: { type: ObjectId },
    doctor_id: { type : ObjectId },
    user_id: { type : ObjectId },
    order_if_active:{type:Boolean, default: false},
    order_if_pay:{type:Boolean, default: false},
    order_if_print:{type:Boolean, default: false},
    order_if_finished:{type:Boolean, default: false},
    order_fee:{type:Number},
    comment:{
        time: {type: Date},
        good_or_bad:{type:Boolean},
        content:{type:String}
    }
});

mongoose.model('Order', OrderSchema);