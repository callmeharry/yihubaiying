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
    hospital_weight: { type: Number},
    hospital_order_count: { type: Number, default: 0 }, // 医院已有订单总量
    hospital_imgsrc: { type: String }, // 医院图片路径
    hospital_is_validated: { type: Boolean, default: false },
    hospital_dept: [
        {
            hospital_dept_name: { type: String },
            hospital_subdept: [
                {
                    hospital_subdept_name: { type: String },
                    hospital_subdept_doc: [{ type: ObjectId }]
                }
            ]

        }
    ]
});

mongoose.model('Hospital', HospitalSchema);


