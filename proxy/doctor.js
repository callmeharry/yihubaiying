/**
 * Created by Megas on 2014/12/9.
 * 与doctor model对应，用于提供数据
 */

var models = require('../models');
var DoctorModel = models.Doctor;

exports.newAndSaveDoctor = function (docName, docIntro, callback) {
    var doctorEntity = new DoctorModel({
        doctor_name: docName,
        doctor_intro: docIntro
    });
    doctorEntity.save(callback);
};

exports.newDoctorVisit = function (startTime, endTime, totalSource, leftSource, callback) {
    var doctorVisit = new Array({
        visit_start_time: startTime,
        visit_end_time: endTime,
        totalSource: totalSource,
        leftSource: leftSource
    });
    doctorVisit.save(callback);
};

