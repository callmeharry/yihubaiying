/**
 * Created by Megas on 2014/12/9.
 * 与hospital model交互，用于提供数据
 */

var models = require('../models');
var Hospital = models.Hospital;

/**
 * 根据医院所在城市获取10个医院
 * @param city
 * @param callback
 */
exports.getTenHospitalsByCity = function (city, callback) {
    Hospital.find({hospital_city: city}, null,
        {sort: '_id', limit: 10}, callback);
};
