/**
 * Created by Megas on 2014/11/29.
 * 医呼百应 医生模型
 * 根据14-05-数据库设计说明书v1.1.0完成
 * Todo：未加索引
 * what happened??
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config');

var DoctorSchema = new Schema({
    doctor_name: { type: String },
    doctor_intro: { type: String },
    doctor_advanced_illness_name: {type: String},
    doctor_good_reputation: {type: Number, default: 0},
    doctor_visit: [
        {
            //visit_period: { type: Number, default: 0},弃用该属性
            visit_start_time: {type: Date},
            visit_end_time: {type: Date},
            totalSource: { type: Number },
            leftSource: { type: Number }
        }
    ]
});

mongoose.model('Doctor', DoctorSchema);
