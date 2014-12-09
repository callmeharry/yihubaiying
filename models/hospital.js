/**
 * Created by Megas on 2014/11/29.
 * 医呼百应 医院模型
 * 根据14-05-数据库设计说明书v1.1.0完成
 * Todo：未加索引
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config');

var HospitalSchema = new Schema({
    hospital_name: { type: String },
    hospital_intro: { type: String },
    hospital_city: { type: String },
    hospital_location: { type: String },
    hospital_tel: { type: String },
    hospital_is_validated: { type: Boolean, default: false },
    hospital_dept: [
        {
            hospital_dept_id: { type: ObjectId },
            hospital_dept_name: { type: String },
            hospital_dept_doc: [{ type: ObjectId }]
        }
    ]
});

mongoose.model('Hospital', HospitalSchema);
