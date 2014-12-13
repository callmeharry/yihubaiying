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
exports.newHospital = function (hospitalName, hospitalIntro, hospitalCity, i, callback) {

    var hospital = new Hospital({
        hospital_name: hospitalName,
        hospital_intro : hospitalIntro,
        hospital_city : hospitalCity,
        hospital_location : "hospitalLocation" + i,
        hospital_tel : i + "0000000",
        hospital_is_validated : true

    });
    hospital.save(callback);
    //console.log('new hospital' + hospitalName + hospitalIntro + hospitalCity);
};

exports.newDepartment = function (deptName, i, callback) {
    var department = new Array({
        hospital_dept_name: deptName + i,

    })
};

exports.newSubDept = function (subDeptName, i, callback) {
    var subDeptName = new Array({
        hospital_subdept_name: subDeptName + i,

    })
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
//todo:middleDepartments是什么？？
exports.getHospitalsByHospitalId = function (id, callback) {
    Hospital.findOne({_id: id},
        {hospital_name: 1, hospital_location: 1, hospital_tel: 1,hospital_order_count: 1, hospital_imgsrc: 1})
};

/**
 * 通过city(城市名)获取该城市的所有医院信息,依照热门程度(hospital_weight)降序排列
 * @param city
 * @param callback
 */
exports.getTenHospitalsByCity = function (city, callback) {
    Hospital.find({hospital_city: city},
        {hospital_name: 1, hospital_location: 1, hospital_tel: 1,hospital_order_count: 1, hospital_imgsrc: 1},
        {sort: 'hospital_weight', limit: 10}, callback);
};

/**
 * 通过hospitalId查找医院的信息(基本信息,和科室信息)
 * @param hospitalId
 * @param departmentId
 * @param callback
 */
exports.getDocsByHospitalIdAndDepartmentId = function (hospitalId, departmentId, callback) {
    Hospital.findOne({hospital_id: hospitalId, "hospital_dept.hospital_subdept._id": departmentId},
        {hospital_name: 1, hospital_location: 1, hospital_tel: 1,hospital_order_count: 1, hospital_imgsrc: 1},
        {sort: 'hospital_dept.hospital_subdept._id', limit: 10}, callback);
};

