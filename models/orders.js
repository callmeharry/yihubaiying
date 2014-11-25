/**
 * Created by steve on 14-11-23.
 */
/** 医呼百应 订单模型 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    order_time:{type:Date},
    order_see_time:{type:Date},
    doctor:{type:ObjectId},
    user:{type:ObjectId},
    order_if_active:{type:Boolean, default: false},
    order_if_pay:{type:Boolean, default: false},
    order_if_print:{type:Boolean, default: false},
    order_if_finished:{type:Boolean, default: false},
    comment:{
        time:{type:Date},
        good_or_bad:{type:Boolean},
        content:{type:String}
    }
});

mongoose.model('order',OrderSchema);