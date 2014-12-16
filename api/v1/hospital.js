/**
 * Created by Megas on 2014/12/16.
 */
var models = require('../../models');
var HospitalModel = models.Hospital;
var HospitalProxy = require('../../proxy').Hospital;
var DoctorProxy = require('../../proxy').Doctor;
var config = require('../../config');
var eventproxy = require('eventproxy');
var _ = require('lodash');

var showHospitalIntro = function (req, res, next) {
    var hosId = req.query.ak;

    if (!(HospitalModel.findOne({_id: hosId}))) {
        return res.send('不存在该医院的信息。');
    }

    HospitalProxy.getHospitalByHospitalId(hosId, function(err, hospital) {
        if (err) {
            return callback(err);
        }

        var hos_dept = hospital.hospital_dept;
        var doctors = new Array();

        var proxy = new eventproxy();
        proxy.after('show', hos_dept.length, function () {
            var hosIntro = {
                hospital_name: hospital.hospital_name,
                hospital_name: hospital.hospital_name,
                hospital_intro: hospital.hospital_intro,
                hospital_city: hospital.hospital_city,
                hospital_location: hospital.hospital_location,
                hospital_tel: hospital.hospital_tel,
                hospital_weight: hospital.hospital_weight,
                create_at: hospital.create_at,
                hospital_order_count: hospital.hospital_order_count, // 医院已有订单总量
                hospital_imgsrc: hospital.hospital_imgsrc, // 医院图片路径
                hospital_is_validated: hospital.hospital_is_validated,
                hospital_doctors: doctors
            };
            res.send({hospitalIntro: hosIntro});
        });

        for (var m = 0, length = hos_dept.length; m < length; m++) {
            var dept_doc = hospital.hospital_dept[i].dept_doc;
            for (var n = 0, length = dept_doc.length; n < length; n++) {
                (function (i) {
                    var docId = dept_doc[i];
                    DoctorProxy.getDoctorById(docId, function (err, doctor) {
                        if (err) return callback(err);
                        doctors.push({
                            doc_dept: hospital.hospital.hospital_dept[i].dept_name,
                            doc_name: doctor.doctor_name,
                            doc_visit_start_time: doctor.doctor_visit.visit_start_time,
                            doc_visit_end_time: doctor.doctor_visit.visit_end_time,
                            doc_total_source: doctor.doctor_visit.totalSource
                        });

                        return proxy.emit('show');
                    });
                })(n);
            }
        }
    });
};

exports.showHospitalIntro = showHospitalIntro;
