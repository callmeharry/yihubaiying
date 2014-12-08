/**
 * Created by steve on 14-12-8.
 * yihubaiying book page
 */

var eventproxy = require('eventproxy');

exports.chooseHospitalInCity = function (req, res) {

    //res.redirect('/mobile/book/ii');
}
exports.showHospital = function (req, res, next) {
    var data = req.query.city;
    console.log(data);
    var user = {_id: 123, name: 1234};
    var hospital = new Array();
    hospital[0] = {name: 'name', address: 'add', phoneNumber: 'phone', _id: 'noid', orderCount: '333', imgsrc: null};
    res.render('mobile/mHospitalSelect', {user: user, hospital: hospital});
}

exports.showDepartment = function (req, res, next) {
    var user = {_id: 123, name: 1234};
    var hospitalId = res.query.hospitalid;
    res.render('mobile/mDepartments', {user: user});
}