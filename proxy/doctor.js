/**
 * Created by Megas on 2014/12/9.
 * 与doctor model对应，用于提供数据
 */

var models = require('../models');
var Doctor = models.Doctor;

exports.newAndSaveDoctor = function (docName, docIntro, callback) {
    var doctor = new DoctorModel({
        doctor_name: docName,
        doctor_intro: docIntro
    });
    doctor.save(callback);
};

exports.addDoctorVisit = function (docId, startTime, endTime, totalSource, leftSource, callback) {
    Doctor.update({_id: docId}, {$push: {doctor_visit: {
        visit_start_time: startTime,
        visit_end_time: endTime,
        totalSource: totalSource,
        leftSource: leftSource
    }}}, callback);
};

exports.addDocAdvancedIllnessName = function(docId, illName, callback) {
    Doctor.update({_id: docId}, {$push: {doctor_advanced_illness_name: illName}}, callback);
};

exports.getDoctorById = function (doc_id, callback) {

    Doctor.findOne({_id: doc_id}, callback);
};

exports.getDoctorByQuery = function (query, opt, callback) {
    Doctor.find(query, '', opt, callback);
};

