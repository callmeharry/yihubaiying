/**
 * Created by Megas on 2014/11/29.
 * 医呼百应 医生模型
 * 根据14-05-数据库设计说明书v1.1.0完成
 * Todo：未加索引
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config');

var DoctorSchema = new Schema({
    doctor_name: { type: String },
    doctor_intro: { type: String },
    doctor_advanced_disease: [{ type: String }],
    doctor_visit: [
        {
            visit_period: { type: Number, default: 0},
            visit_time: { type: Number }, //时间类型
            is_on_duty: { type: Boolean, default:false },
            totalSource: { type: Number },
            leftSource: { type: Number }
        }
    ]
});

mongoose.model('Doctor', DoctorSchema);
