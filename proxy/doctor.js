/**
 * Created by Megas on 2014/12/9.
 * 与doctor model对应，用于提供数据
 */

var models = require('../models');
var Doctor = models.Doctor;
var Hospital = models.Hospital;

exports.newAndSaveDoctor = function (dept_id, docName, docIntro, goods, doc_imgsrc, callback) {
    var doctor = new Doctor();
    doctor.doctor_name = docName;
    doctor.doctor_intro = docIntro;
    doctor.doctor_advanced_illness_name = goods;
    doctor.doctor_imgsrc = doc_imgsrc;
    var query = {"hospital_dept._id": dept_id};
    var options = {"hospital_dept.$": 1};
    //save the objectid to dept
    Hospital.findOne(query, {}, function (err, hospital) {
        if (err) return callback(err);
        var index;
        console.log(hospital);
        var index;
        for(var j = 0; j<hospital.hospital_dept.length; j++)
        {   var id = hospital.hospital_dept[j]._id;
            console.log( id+"   "+dept_id);
            if(id == dept_id )
               index = j;

        }

        console.log(index);
        hospital.hospital_dept[index].dept_doc.push(doctor._id);
        hospital.save(function (err) {
            if (err) return callback(err);
            doctor.save(callback);
        })
    });


};

exports.addDoctorVisit = function (docId, ups, callback) {
    Doctor.update({_id: docId}, {
        $push: {
            doctor_visit: ups
        }
    }, callback);
};

exports.addDocAdvancedIllnessName = function (docId, illName, callback) {
    Doctor.update({_id: docId}, {$push: {doctor_advanced_illness_name: illName}}, callback);
};

exports.getDoctorById = function (doc_id, callback) {

    Doctor.findOne({_id: doc_id}, callback);
};

exports.getDoctorByQuery = function (query, opt, callback) {
    Doctor.find(query, '', opt, callback);
};

exports.updateDoctorByQuery = function(query, ups, callback){
    Doctor.update(query , ups, callback);
};

exports.dropDoctor = function(dept_id, doc_id, callback){
    var query = {"hospital_dept._id": dept_id};
    var options = {"hospital_dept.$": 1};

    Hospital.findOne(query, options, function(err, hospital){
        if(err) callback(err);

        console.log(hospital);
        hospital.hospital_dept[0].dept_doc.pull(doc_id);
        console.log(hospital.hospital_dept[0].dept_doc);
        hospital.save(function(err){
            if(err) return callback(err);
            Doctor.remove({_id:doc_id},callback);
        });
    });
};
