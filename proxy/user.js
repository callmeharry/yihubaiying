/**
 * Created by Megas on 2014/12/2.
 * 与user model对应,用于提供数据
 */

var models = require('../models');
var User = models.User;
var Hospital = require('../proxy/hospital');
var Doctor = require('../proxy/doctor');
var validator = require('validator');
var eventproxy = require('eventproxy');

/**
 * 根据用户名列表查找用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 * @returns {*}
 */
//exports.getUsersByPhoneNumber = function (phoneNumber, callback) {
//    if (phoneNumber.length === 0) {
//        return callback(null, []);
//    }
//    User.find({ phone_number: { $in: phoneNumber }}, callback);
//};

exports.getOneUserByPhoneNumber = function (phoneNumber, callback) {
    User.findOne({phone_number: phoneNumber}, callback);
};

exports.newAndSave = function (mobileNumber, socialNumber, password, city, name, callback) {
    var user = new User();
    user.phone_number = mobileNumber;
    user.social_number = socialNumber;
    user.password = password;
    user.user_state = city;
    user.real_name = name;
    user.save(callback);
};

exports.getOneUserByPhoneNumberAndPassword = function (phoneNumber, password, callback) {
    User.findOne({phone_number: phoneNumber, password: password}, callback);
};


exports.getUserByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
};

exports.getCountByQuery = function (query, callback) {
    User.count(query, callback);

};


exports.updateByQuery = function (query, opt, callback) {
    User.update(query, opt, callback);

};

exports.getUserById = function (id, callback) {
    User.findOne({_id: id}, callback);
};

exports.dropUser = function (query, callback) {

    User.remove(query, callback);
};

exports.getFavoritesByQuery = function(user_id,callback){

    //get hospitals
    User.findOne({_id:user_id},function(err, user){
        if(err) return callback(error,null);

        var proxy = new eventproxy();
        proxy.fail(callback);

        var myFHospitals = new Array();

        var mFDoctors = new Array();

        proxy.after('updates',user.favourite_doctor.length + user.favourite_hospital.length,
            function(){
                var new_user = {};
                new_user._id = user._id;
                new_user.real_name=  user.real_name;
                new_user.favourite_hospital = myFHospitals;
                new_user.favourite_doctor = mFDoctors;
                callback(null, new_user);
        });




        for(var j = 0; j<user.favourite_hospital.length;j++) {
            (function(i){
                var hospital_id = user.favourite_hospital[i];

                Hospital.getHospitalByHospitalId(hospital_id,function(err, hosptial){
                    if(err) return callback(err,[]);

                    myFHospitals.push({
                        hospital_id:hosptial._id,
                        hospital_name:hosptial.hospital_name,
                        hospital_intro:hosptial.hospital_intro,
                        hospital_location:hosptial.hospital_location,
                        hospital_tel:hosptial.hospital_tel,
                        hospital_imgsrc:hosptial.hospital_imgsrc,
                        hospital_city:hosptial.hospital_city
                    });

                    return proxy.emit('updates');
                });

            })(j);

        }



        for(var m = 0; m < user.favourite_doctor.length; m++) {
            (function(n){
                var doctor_id = user.favourite_doctor[n].doctor_id;

                Doctor.getDoctorById(doctor_id, function(err, doctor){
                    if(err) callback(err,[]);

                    mFDoctors.push({
                        doc_id:doctor._id,
                        doc_name:doctor.doctor_name,
                        doc_intro:doctor.doctor_name,
                        doc_goods:doctor.doctor_advanced_illness_name,
                        doc_imgsrc:doctor.doctor_imgsrc,
                        doc_hospital:user.favourite_doctor[n].hospital
                    });

                    return proxy.emit('updates');
                });

            })(m);

        }



    });

};


