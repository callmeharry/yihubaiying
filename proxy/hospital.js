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

