/**
 * Created by Megas on 2014/12/9.
 * 与hospital model交互，用于提供数据
 */

var models = require('../models');
var Hospital = models.Hospital;
/**
 * save a new hospital
 * @param hospitalName
 * @param hospitalIntro
 * @param callback
 */
exports.newHospital = function (hospitalName, hospitalIntro, callback) {

    var hospital = new Hospital();
    hospital.hospital_name = hospitalName;
    hospital.hospital_intro = hospitalIntro;
    hospital.hospital_is_validated = true;
    hospital.save(callback);

};

 * 根据医院所在城市获取10个医院
 * @param city
 * @param callback
 */
exports.getTenHospitalsByCity = function (city, callback) {
    Hospital.find({hospital_city: city}, null,
        {sort: '_id', limit: 10}, callback);
};
