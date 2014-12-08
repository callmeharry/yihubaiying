/**
 * Created by steve on 14-12-8.
 * 医呼百应 预约挂号逻辑
 */

var eventproxy = require('eventproxy');

/**
 * 显示医院列表
 * @param req
 * @param res
 * @param next
 */
exports.showHospital = function (req, res, next) {
    var data = req.query.city;
    var user = {_id: 123, name: 1234};
    var hospital = new Array();
    hospital[0] = {name: 'name', address: 'add', phoneNumber: 'phone', _id: 'noid', orderCount: '333', imgsrc: null};
    hospital[1] = {
        name: 'name2',
        address: 'add2',
        phoneNumber: 'phone2',
        _id: 'noid2',
        orderCount: '3333',
        imgsrc: null
    };
    res.render('mobile/mHospitalSelect', {user: user, hospital: hospital});
}

/**
 * 显示科室列表
 * @param req
 * @param res
 * @param next
 */
exports.showDepartment = function (req, res, next) {
    var user = {_id: 123, name: 1234};
    var hospitalId = req.query.hospitalid;

    var middleDepartments = new Array();
    for (var i = 0; i < 2; i++) {
        var smallDepartments = new Array();
        for (var j = 0; j < 4 * i + 8; j++) {
            var smallName = 'smallDepartments' + i + '-' + j;
            var smallId = i + i + j + j;
            smallDepartments[j] = {_id: smallId, name: smallName};
        }

        var middleName = 'middleDepartments' + i;
        middleDepartments[i] = {name: middleName, smallDepartments: smallDepartments};
    }
    var hospital = {
        name: 'name',
        address: 'add',
        phoneNumber: 'phone',
        _id: 'noid',
        orderCount: '333',
        imgsrc: null,
        middleDepartments: middleDepartments
    };
    res.render('mobile/mDepartments', {user: user, hospital: hospital});
}

exports.showDoctor = function (req, res, next) {
    var departmentId = req.query.departmentid;
    res.render('mobile/mDoctors');
}