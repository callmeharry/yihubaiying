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
exports.newHospital = function (hospitalName, hospitalIntro, hospitalCity, hospitalLocation,
                                hospitalTel, hospitalWeight, callback) {

    var hospital = new Hospital();
    hospital.hospital_name = hospitalName;
    hospital.hospital_intro = hospitalIntro;
    hospital.hospital_city = hospitalCity;
    hospital.hospital_location = hospitalLocation;
    hospital.hospital_tel = hospitalTel;
    hospital.hospital_is_validated = true;
    hospital.hospital_weight = hospitalWeight;
    hospital.save(callback);
    //console.log('new hospital' + hospitalName + hospitalIntro + hospitalCity);
};

exports.addDepartment = function (hospitalId, fatherDeptName, deptName, callback) {
    Hospital.update({'_id': hospitalId}, {'push': {'hospital_dept': {'father_dept_name': fatherDeptName, 'dept_name': deptName}}}, callback);
};

exports.addDeptDoc = function (hospitalId, deptId, docId, callback) {
    Hospital.update({'_id': hospitalId, 'hospital_dept._id': deptId}, {'push': {'hospital_dept.dept_doc': docId}}, callback);
};

exports.getHospitalsByHospitalId = function (id, callback) {
    Hospital.findOne({_id: id}, callback);
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

/**
 * get total number of hospital
 * @param query
 * @param callback
 */
exports.getCountByQuery = function (query, callback) {
    Hospital.count(query, callback);
};


exports.getHospitalsByQuery = function (query, opt, callback) {
    Hospital.find(query, '', opt, callback);
};

