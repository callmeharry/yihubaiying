/**
 * Created by Megas on 2014/12/9.
 * 与hospital model交互，用于提供数据
 * Todo: 新建医院时加入权重参数
 */

var models = require('../models');
var Hospital = models.Hospital;
/**
 * save a new hospital
 * @param hospitalName
 * @param hospitalIntro
 * @param callback
 */
exports.newHospital = function (hospitalName, hospitalIntro, hospitalCity, callback) {

    var hospital = new Hospital();
    hospital.hospital_name = hospitalName;
    hospital.hospital_intro = hospitalIntro;
    hospital.hospital_city = hospitalCity;
    hospital.hospital_location = 'hospital_location';
    hospital.hospital_tel = '00000000';
    hospital.hospital_is_validated = true;
    hospital.save(callback);
    //console.log('new hospital' + hospitalName + hospitalIntro + hospitalCity);
};
// 加入权重的函数
//exports.newHospital = function (hospitalName, hospitalIntro, hospitalWeight, callback) {
//
//    var hospital = new Hospital();
//    hospital.hospital_name = hospitalName;
//    hospital.hospital_intro = hospitalIntro;
//    hospital.weight = hospitalWeight;
//    hospital.hospital_is_validated = true;
//    hospital.save(callback);
//
//};

/**
 * 通过city(城市名)获取该城市的所有医院信息,依照热门程度(hospital_weight)降序排列
 * @param city
 * @param callback
 */
exports.getTenHospitalsByCity = function (city, callback) {
    Hospital.find({hospital_city: city},
        {hospital_name: 1, hospital_location: 1, hospital_tel: 1,hospital_order_count: 1, hospital_imgsrc: 1},
        {sort: 'hospital_weight', limit: 10}, callback);
    //Hospital.find({hospital_city: city}, null,
    //    {sort: 'hospital_weight', limit: 10}, callback
    //    );
};

