/**
 * Created by Megas on 2014/12/16.
 * Todo:用例YHBY-502中的描述：
 * 医院工作者可以修改、更新医院的信息。包括医院的基本资料、以及医院提供的挂号信息。
 * 可能与用例YHBY-503描述
 * 故未实现YHBY-502中对挂号信息的显示
 */
var models = require('../../models');
var HospitalModel = models.Hospital;
var HospitalProxy = require('../../proxy').Hospital;
var DoctorProxy = require('../../proxy').Doctor;
var config = require('../../config');
var eventproxy = require('eventproxy');
var _ = require('lodash');

/**
 * 显示医院基本信息
 * 与用例YHBY-501对应
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var showHospitalInfo = function (req, res, next) {
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
            var hosInfo = {
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
            res.send({hospitalIntro: hosInfo});
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

exports.showHospitalInfo = showHospitalInfo;

/**
 * 修改医院基本信息
 * 余下的函数全部与用例YHBY-502对应
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var updateHospitalBicInfo = function (req, res, next) {
    var hosId = req.query.ak; //post提交不可用query？

    var name = req.body.hospital_name;
    var intro = req.body.hospital_intro;
    var city = req.body.hospital_city;
    var location = req.body.hospital_location;
    var tel = req.body.hospital_tel;
    var imgsrc = req.body.hospital_imgsrc;

    if (!(HospitalModel.findOne({_id: hosId}))) {
        return res.send('不存在该医院的信息，无法修改');
    }

    HospitalProxy.getHospitalByHospitalId(hosId, function (err, hospital) {
        if (err) {
            return callback(err);
        }

        var conditions = {_id: hosId};
        var update = {
            $set: {
                hospital_name: name,
                hospital_intro: intro,
                hospital_city: city,
                hospital_location: location,
                hospital_tel: tel,
                hospital_imsrc: imgsrc
            }
        };
        var options = {};
        HospitalProxy.update(conditions, update, options, function (err) {
            if (err) {
                return res.send('修改出错');
            } else {
                res.send({updatedHospitalInfo: hospital});
            }
        });
    });
};

exports.updateHospitalBicInfo = updateHospitalBicInfo;

/**
 * 修改医院科室信息
 * @param req
 * @param res
 * @param next
 */
var updateHospitalDeptInfo = function (req, res, next) {
    var hosId = req.query.ak;
    var deptId = req.query.deptId;

    var fName = req.body.father_dept_name;
    var dName = req.body.dept_name;

    var query = {_id: hosId, 'hospital_dept._id': deptId};
    var option = {};
    HospitalProxy.getOneHospitalByQuery(query, option, function (err, hospital) {
        if (err) {
            return callback(err);
        }

        var update = {
            $set: {
                'hospital_dept.father_dept_name': fName,
                'hospital_dept_dept_name': dName
            }
        };
        HospitalProxy.update(query, update, option, function (err) {
            if (err) {
                res.send('修改出错');
            } else {
                res.send({updatedHospitalInfo: hospital});
            }
        })
    });
};

exports.updateHospitalDeptInfo = updateHospitalDeptInfo;

/**
 * 将医生ID添加到特定科室
 * @param req
 * @param res
 * @param next
 */
var addDocToDept = function (req, res, next) {
    var hosId = req.query.ak;
    var deptId = req.query.deptId;
    var docId = req.query.docId;

    var query = {_id: hosId, 'hospital_dept._id': deptId};
    var option = {};
    HospitalProxy.getOneHospitalByQuery(query, option, function (err, hospital) {
        if (err) {
            return callback(err);
        }
        hospital.update({
            _id: hosId,
            'hospital_dept._id': deptId
        }, {$push: {'hospital_dept.dept_doc': docId}}, callback);
    });
};

exports.addDocToDept = addDocToDept;

/**
 * 根据ID将医生从科室中删除
 * @param req
 * @param res
 * @param next
 */
var removeDocFromDept = function (req, res, next) {
    var hosId = req.query.ak;
    var deptId = req.query.deptId;
    var docId = req.query.docId;

    var query = {_id: hosId, 'hospital_dept._id': deptId};
    var option = {};
    HospitalProxy.getOneHospitalByQuery(query, option, function (err, hospital) {
        if (err) {
            return callback(err);
        }
        hospital.remove({
            'hospital_dept.dept_doc': docId
        }, callback);
    });
};

exports.removeDocFromDept = removeDocFromDept;



