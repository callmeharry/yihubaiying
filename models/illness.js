/**
 * Created by Megas on 2014/11/29.
 * 医呼百应 疾病模型
 * 根据14-05-数据库设计说明书v1.1.0完成
 * Todo：未加索引
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config = require('../config');

var IllnessSchema = new Schema({
    illness_id: { type: ObjectId },
    ill_name: { type: String },
    ill_describe: { type: String },
    ill_cause: { type: String },
    ill_theory: { type: String },
    ill_check: { type: String },
    ill_secure_method: { type: String },
    recomend_doc: [{ type: ObjectId }],
    recomend_hos: [{ type: ObjectId }]
});

mongoose.model('Illness', IllnessSchema);
