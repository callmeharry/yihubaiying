/**
 * Created by Megas on 2014/11/29.
 * 医呼百应 用户模型
 * 根据14-05-数据库设计说明书v1.1.0完成
 * Todo: 将文档中字段的驼峰命名改为下划线命名
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var config = require('../config');

var UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    real_name: { type: String },
    social_number: { type: String },
    address: { type: String },
    email: { type: String },
    user_state: {type: String},
    phone_number: { type: String },
    credit_level: { type: Number },
    register_time: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    favourite_hospital: [{type: String}],
    favourite_dept: [{ type: String }],
    favourite_doctor: [
        {
            name: { type: String },
            hospital: { type: String }
        }
    ],
    feedback: [
        {
            content: { type: String },
            ifcheck: { type: Boolean, default: false },
            check_message: { type: String },
            date: { type: Date, default: Date.now }
        }
    ],
    system_message: [
        {
            content: { type: String },
            date: { type: Date, default: Date.now }
        }
    ]
});

UserSchema.index({phone_number: 1}, {unique: true});
UserSchema.index({password: 1}, {unique: true});

mongoose.model('User', UserSchema);