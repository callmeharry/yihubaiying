/**
 * Created by steve on 14-12-8.
 * 医呼百应 预约挂号逻辑
 */

var eventproxy = require('eventproxy');
var Hospital = require('../proxy/').Hospital;
var Order = require('../proxy/order');
var tool = require('../middlewares/tool');
var currPage = tool.setCurrentPage;
var config = require('../config');

/**
 * 显示医院列表
 * @param req
 * @param res
 * @param next
 */
exports.showHospital = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    var limit = config.page_limit;
    var city = req.cookies.city;
    var username = req.cookies.username;
    var query = {hospital_city: city};

    var proxy = new eventproxy();
    proxy.fail(next);

    Hospital.getCountByQuery(query, proxy.done(function (all_hospital_count) {
        var pages = Math.ceil(all_hospital_count / limit);
        proxy.emit('pages', pages);
    }));

    //get hospital infos according to pages
    var options = {skip: (page - 1) * limit, limit: limit, sort: "-create_date"};
    Hospital.getHospitalsByQuery(query, options, proxy.done('hospitals', function (hospitals) {
        return hospitals;
    }));
    proxy.all('pages', 'hospitals', function (pages, hospitals) {
        currPage(req, res);
        if (!tool.getDeviceType(req.url)) {
            res.render('pc/choose_hospital', {
                page: page,
                pages: pages,
                hospital: hospitals,
                username: username,
                title: '选择医院'
            });
        } else {
            res.render('mobile/mHospitalSelect', {
                page: page,
                pages: pages,
                hospital: hospitals,
                username: username,
                title: '选择医院'
            });
        }
    });
    //Hospital.getTenHospitalsByCity(city, function (err, hospitals) {
    //    if (err) {
    //        res.send("error happened during get ten hospitals by city.");
    //    } else {
    //        currPage(req, res);
    //        console.log(username);
    //        if (!tool.getDeviceType(req.url)) {
    //            return res.render('pc/choose_hospital', {username: username, hospital: hospitals, title: '选择医院'});
    //        } else {
    //            return res.render('mobile/mHospitalSelect', {
    //                username: username,
    //                hospital: hospitals,
    //                title: '选择医院'
    //            });
    //        }
    //    }
    //});
};

/**
 * 显示科室列表
 * @param req
 * @param res
 * @param next
 */
exports.showDepartment = function (req, res, next) {
    var username = req.cookies.username;
    var hospitalId = req.query.hospitalid;
    var proxy = new eventproxy();
    //下面的数据要替换成数据库中的信息
    proxy.fail(next);
    var hospital_origin;
    var query = {_id:hospitalId};
    Hospital.getOneHospitalByQuery(query, options, proxy.done("hospital", function (hospital) {
        hospital_origin = hospital;
    }));
    var departments = new Array();
    var i = 0;
    for(var j = 0; j < hospital_origin.hospital_dept.length; j++ ){
        var flag = 0;
        for(var k = 0; k < i; k++) {
            if(departments[i].name == hospital_origin.hospital_dept[j].father_dept_name){
                var len = departments[i].subDepartments.length;
                departments[i].subDepartments[len] = hospital_origin.hospital_dept[j].dept_name;
                flag = 1;
            }
        }
        if(flag == 0){
            var subDepartments = new Array();
            subDepartments[0] = hospital_origin.hospital_dept[j].dept_name;
            departments[i++] = {
                name:hospital_origin.hospital_dept[j].father_dept_name,
                subDepartments:subDepartments
            }
        }
    }
    var hospital = {
        hospital_name: hospital_origin.hospital_name,
        hospital_address: hospital_origin.hospital_location,
        hospital_tel: hospital_origin.hospital_tel,
        _id: hospital_origin._id,
        orderCount: hospital_origin.hospital_order_count,
        imgsrc: hospital_origin.hospital_imgsrc,
        departments: departments
    };
    //替换结束
    //显示消息不成功可能是前端对应name的问题
    //Hospital.getDeptByHospitalId(hospitalId, function (err, hospital) {
    //    if (err) {
    //        res.send("error happened during get departments by hospitalId.");
    //    } else {
    //        currPage(req, res);
    //
    //    }
    //});
    console.log('1');
    if (!tool.getDeviceType(req.url)) {
        return res.render('pc/choose_department', {username: username, hospital: hospital, title: '选择科室和时间'});
    } else {
        return res.render('mobile/mDepartments', {username: username, hospital: hospital, title: '选择科室和时间'});
    }
};

/**
 * 显示科室的医生列表
 * @param req
 * @param res
 * @param next
 * TODO:通过hospitalId和departmentId查找所有的医生
 */

exports.showDoctor = function (req, res, next) {
    var username = req.cookies.username;
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
    //Hospital.getDocsByHospitalIdAndDepartmentId(hospitalId, departmentId, function (err))
    currPage(req, res);
    if (!tool.getDeviceType(req.url)) {
        return res.render('pc/choose_doctor', {
            doctor: doctor,
            departmentid: departmentId,
            hospitalid: hospitalId,
            username: username,
            title: '选择医生'
        });
    } else return res.render('mobile/mDoctors', {
        doctor: doctor,
        departmentid: departmentId,
        hospitalid: hospitalId,
        username: username,
        title: '选择医生'
    });
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
    var username = req.cookies.username;
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
    currPage(req, res);
    if (tool.getDeviceType(req.url)) {
        return res.render('mobile/mDatePicker', {
            time: time,
            departmentid: departmentId,
            hospitalid: hospitalId,
            doctorid: doctorId,
            username: username,
            title: '选择看病日期'
        });
    } else {
        return res.render('pc/choose_date', {
            time: time,
            departmentid: departmentId,
            hospitalid: hospitalId,
            doctorid: doctorId,
            username: username,
            title: '选择看病日期'
        });
    }
};
/**
 * 确认订单信息
 * @param req
 * @param res
 * @param next
 */
exports.confirmBook = function (req, res, next) {
    var username = req.cookies.username;
    var hospitalId = req.query.hospitalid;
    var departmentId = req.query.departmentid;
    var doctorId = req.query.doctorid;
    var userId = req.session.user_id;
    var date = req.query.date;
    var time = req.query.time;
    console.log(userId);
    var order = {
        _id: 111,
        hospital: hospitalId,
        dept: departmentId,
        doctor: doctorId,
        see_time: date + time,
        fee: 8,
        address: 'add',
        tel: 13122222
    }
    if (!tool.getDeviceType(req.url)) {
        res.render('pc/confirm_order', {
            username: username, title: '确认订单信息', order: order, departmentid: departmentId,
            hospitalid: hospitalId,
            doctorid: doctorId, time: time, date: date
        });
    } else res.render('mobile/mOrder', {
        username: username, title: '确认订单信息', order: order, departmentid: departmentId,
        hospitalid: hospitalId,
        doctorid: doctorId, time: time, date: date
    });
}
/**
 * 完成订单
 * @param req
 * @param res
 * @param next
 */
exports.finishBook = function (req, res, next) {
    var username = req.cookies.username;
    var hospitalId = req.query.hospitalid;
    var departmentId = req.query.departmentid;
    var doctorId = req.query.doctorid;
    var userId = req.session.user_id;
    var date = req.query.date;
    var time = req.query.time;

    //Order.newAndSaveOrder(hospitalId, departmentId, doctorId, userId, date, function (err) {
    //    if (err) {
    //        res.send(err.message);
    //    }
    //});
    currPage(req, res);
    if (tool.getDeviceType(req.url))
        res.render('mobile/mOrderConfirm', {username: username, title: '订单完成'});
    else {
        res.render('pc/pay_successfully', {username: username, title: '订单完成'});
    }

};

exports.showDepartmentList = function (req, res) {
    var username = req.cookies.username;
    if (tool.getDeviceType(req.url))
        res.render('mobile/mDepartmentList', {username: username, title: '科室列表'})
};
exports.showDiseases = function (req, res) {

};