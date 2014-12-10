/**
 * Created by steve on 14-12-8.
 * 医呼百应 预约挂号逻辑
 */

var eventproxy = require('eventproxy');
var Hospital = require('../proxy/Hospital');
var Order = require('../proxy/Order');

/**
 * 显示医院列表
 * @param req
 * @param res
 * @param next
 */
exports.showHospital = function (req, res, next) {
    var city = req.query.city;
    console.log(city);
    var user = {_id: 123, name: 1234};
    var eventProxy = new eventproxy();

    //Hospital.newHospital('hospital', 'hospitalIntro', '北京', function (err) {
    //    if (err) {
    //        console.log(err);
    //    } else {
    //        console.log('hospital existed');
    //    }
    //});

    Hospital.getTenHospitalsByCity(city, function (err, hospitals) {
        if (err) {
            res.send("error happened during get ten hospitals by city.");
        } else {
            return res.render('mobile/mHospitalSelect', {user: user, hospital: hospitals});
        }
    });
};

/**
 * 显示科室列表
 * @param req
 * @param res
 * @param next
 * TODO:通过hospitalId查找医院的信息(基本信息,和科室信息,见下面的hospital对象)
 */
exports.showDepartment = function (req, res, next) {
    var user = {_id: 123, name: 1234};
    var hospitalId = req.query.hospitalid;
    var eventProxy = new eventproxy();
    //下面的数据要替换成数据库中的信息
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
    //替换结束
    return res.render('mobile/mDepartments', {user: user, hospital: hospital});
};

/**
 * 显示科室的医生列表
 * @param req
 * @param res
 * @param next
 * TODO:通过hospitalId和departmentId查找所有的医生
 */

exports.showDoctor = function (req, res, next) {
    var departmentId = req.query.departmentid;
    var hospitalId = req.query.hospitalid;
    console.log('department:' + departmentId + ' hospital:' + hospitalId);
    var eventProxy = new eventproxy();
    var doctor = new Array();
    for (var i = 0; i < 3; i++) {
        var timeAndSource = new Array();
        //for(var j = 0; j < 4; j++ ){
        //
        //}
        timeAndSource[0] = {
            date: '2014-11-' + i + '7  ',
            time: '10:00-12:00',
            source: '10/20(格式:剩余号源/总号源)'
        };
        timeAndSource[1] = {
            date: '2014-11-' + i + '8  10:00-12:00',
            time: '10:00-12:00',
            source: '11/20(格式:剩余号源/总号源)'
        };
        doctor[i] = {
            _id: 'id' + i,
            imgsrc: null,
            name: '姓名' + i,
            isOnDuty: '是或者否,依据可预约时间段是否出诊',
            timeAndSource: timeAndSource,//时间段和号源数量情况
            goodReputation: '20',//好评数
            intro: '简介' + i,
            advancedDisease: '疾病1,疾病2(数据库里是字符串数组,在这里直接合成为一个字符串)'
        };
    }
    return res.render('mobile/mDoctors', {doctor: doctor, departmentid: departmentId, hospitalid: hospitalId});
};

/**
 * 显示可预约时间
 * @param req
 * @param res
 * @param next
 * TODO:通过hospitalId,departmentId,doctorId查找可预约时间
 * TODO:这个页面的标题让我搞乱了 帮忙改一下吧
 */
exports.showTime = function (req, res, next) {
    var departmentId = req.query.departmentid;
    var hospitalId = req.query.hospitalid;
    var doctorId = req.query.doctorid;
    console.log('department:' + departmentId + ' hospital:' + hospitalId + ' doctor:' + doctorId);
    var eventProxy = new eventproxy();
    var time = new Array();
    for (var i = 0; i < 5; i++) {
        time[i] = {
            canBeOrdered: 'canBeOrdered',//这里指该时段是否有号源剩余有则为'canBeOrdered',否则为'cannotBeOrdered',可预约的框框背景为蓝色,不可预约的为红色
            date: '2014-11-1' + i,
            weekOfDay: '星期x',
            time: '10:00-12:00',
            source: '1' + i + '/50'
        }
    }
    return res.render('mobile/mDatePicker', {
        time: time,
        departmentid: departmentId,
        hospitalid: hospitalId,
        doctorid: doctorId
    });
};

/**
 * 完成订单
 * @param req
 * @param res
 * @param next
 */
exports.finishBook = function (req, res, next) {
    var hospitalId = req.query.hospitalid;
    var departmentId = req.query.departmentid;
    var doctorId = req.query.doctorid;
    var userId = req.session.user_id;
    var date = req.query.date;
    var time = req.query.time;

    order.newAndSaveOrder(hospitalId, departmentId, doctorId, userId, date, time, function (err) {
        if (err) {
            res.send(err.message);
            return;
        }
    });
    res.send('department:' + departmentId + ' hospital:' + hospitalId + ' doctor:' + doctorId + 'user:' + userId + ' date:' + date + ' time:' + time);

};