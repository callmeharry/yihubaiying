/**
 * Created by Megas on 2014/11/30.
 * 医呼百应 数据库索引文件
 */

var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }
});

require('./user');
require('./doctor');
require('./order');
require('./hospital');
require('./illness');

exports.User = mongoose.model('User');
exports.Doctor = mongoose.model('Doctor');
exports.Order = mongoose.model('Order');
exports.Hospital = mongoose.model('Hospital');
exports.Illness = mongoose.model('Illness');

