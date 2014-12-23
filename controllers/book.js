/**
 * Created by steve on 14-12-8.
 * 医呼百应 预约挂号逻辑
 */

var eventproxy = require('eventproxy');
var Hospital = require('../proxy/').Hospital;
var Doctor = require('../proxy/').Doctor;
var User = require('../proxy/').User;
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
    var department = req.query.department;
    var query = {hospital_city: city};
    console.log(city);
    if(department)
    query = {hospital_city:city,"hospital_dept.dept_name":department};
    console.log(query);
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
    var userId = req.session.user._id;
    var proxy = new eventproxy();
    //下面的数据要替换成数据库中的信息
    proxy.fail(next);
    var query = {_id:hospitalId};
    var options = {};
    Hospital.getOneHospitalByQuery(query, options, proxy.done("hospital", function (hospital) {
        //initialize departmentlist
        var departments = new Array();
        var i = 0;
        for(var j = 0; j < hospital.hospital_dept.length; j++ ){
            var flag = 0;
            for(var k = 0; k < i; k++) {
                if(departments[k].name == hospital.hospital_dept[j].father_dept_name){
                    var len = departments[k].subDepartments.length;
                    departments[k].subDepartments[len] = hospital.hospital_dept[j].dept_name;
                    departments[k].subDepartments_id[len] = hospital.hospital_dept[j]._id;
                    flag = 1;
                }
            }
            if(flag == 0){
                var subDepartments = new Array();
                var subDepartments_id = new Array();
                subDepartments[0] = hospital.hospital_dept[j].dept_name;
                subDepartments_id[0] = hospital.hospital_dept[j]._id;
                departments[i++] = {
                    name:hospital.hospital_dept[j].father_dept_name,
                    subDepartments:subDepartments,
                    subDepartments_id:subDepartments_id
                }
            }
        }
        var collection = "收藏";
        User.getUserByQuery({"_id":userId},{},function(err,currUser){
            console.log(currUser);
            for(var r = 0; r < currUser[0].favourite_hospital.length ; r++){
                console.log(currUser[0].favourite_hospital[r] + " " + hospitalId);
                if(currUser[0].favourite_hospital[r] == hospitalId)
                    collection = "取消收藏";
            }

            //initialize date table
            var date = new Date();
            var dateList = new Array();
            for(var i = 0 ; i < 14 ; i = i + 2) {
                var new_date = new Date();
                new_date.setTime(date.getTime() + 1000 * 60 * 60 * 24);
                date = new_date;
                dateList[i] = (new_date.getMonth() + 1) + '月' + (new_date.getDate()) + '日上午';
                dateList[i + 1] = (new_date.getMonth() + 1) + '月' + (new_date.getDate()) + '日下午';
            }
            console.log(collection);
            var hospitala = {
                hospital_name: hospital.hospital_name,
                hospital_address: hospital.hospital_location,
                hospital_tel: hospital.hospital_tel,
                _id: hospital._id,
                hospital_order_count: hospital.hospital_order_count,
                imgsrc: hospital.hospital_imgsrc,
                departments: departments,
                dateList: dateList,
                collection:collection
            };
            if (!tool.getDeviceType(req.url)) {
                return res.render('pc/choose_department', {username: username, hospital: hospitala, title: '选择科室和时间'});
            } else {
                return res.render('mobile/mDepartments', {username: username, hospital: hospitala, title: '选择科室和时间'});
            }
        })

    }));



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
    var date = req.query.date;
    var dateNum = req.query.datenum;
    var hospitalName = req.query.hospitalname;
    var url = req.query.previouspage;
    var userId = req.session.user._id;
    var today = new Date();
    var weekOfTomorrow = today.getDay() + 1;

    var proxy = new eventproxy();
    console.log('department:' + departmentId + ' hospital:' + hospitalId);
    var proxy = new eventproxy();
    proxy.fail(next);
    if(!username){
        if (tool.getDeviceType(req.url))
            res.render('mobile/mLogin', {previousurl: url,title: '医呼百应:登录', error:''});
        else
            res.render('pc/login', {previousurl: url, error:''});
    }else{
        User.getUserByQuery({"_id":userId},{},function(err,currUser){
            proxy.emit("user",currUser);
        });
        proxy.all("user",function(user){
            console.log(user[0]);
            Hospital.getDoctorsByDeptAndDate(departmentId, dateNum,proxy.done('hospital', function (hospital) {
                var doctor = new Array();
                for(var i = 0; i < hospital.doctors.length; i++) {
                    var flag = '否';//not on duty
                    var timeAndSource = new Array();
                    var k = 0;
                    for(var j = 0; j < hospital.doctors[i].doc_visit.length; j++){
                        if(hospital.doctors[i].doc_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].totalSource != '0') {
                            flag = '是';
                            timeAndSource[k++] = {
                                time : tool.getDateByNum(j) + hospital.doctors[i].doc_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].visit_start_time + ' ~ ' + hospital.doctors[i].doc_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].visit_end_time,
                                source: hospital.doctors[i].doc_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].leftSource + '/' + hospital.doctors[i].doc_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].totalSource
                            }
                        }
                    }

                    if(flag == '否')
                        timeAndSource = {
                            time:'无',
                            source:''
                        };
                    var collection = "收藏";
                    for(var p = 0 ; p < user[0].favourite_doctor.length ; p++){
                        console.log(user[0].favourite_doctor[p].doctor_id + " " + hospital.doctors[i]._id)
                        if(user[0].favourite_doctor[p].doctor_id == hospital.doctors[i]._id){
                            collection = "取消收藏";
                            break;
                        }
                    }
                    doctor[i] = {
                        name:hospital.doctors[i].doc_name,
                        imgsrc:null, //TODO
                        isOnDuty:flag,
                        timeAndSource:timeAndSource,
                        goodReputation:hospital.doctors[i].doc_rep,
                        intro:hospital.doctors[i].doc_intro,
                        advancedDisease:hospital.doctors[i].good_illness,
                        _id:hospital.doctors[i]._id,
                        collection:collection
                    }
                }
                currPage(req, res);
                var title = '选择医生';
                if(dateNum != -1){
                    console.log(dateNum+" dd");
                    title += '(' + tool.getDateByNum(dateNum) + (dateNum % 2 == 0 ? '上' : '下') + '午)';
                }
                if (!tool.getDeviceType(req.url)) {
                    return res.render('pc/choose_doctor', {
                        doctor: doctor,
                        departmentid: departmentId,
                        hospitalid: hospitalId,
                        datenum:dateNum,
                        username: username,
                        title: title,
                        hospital_name:hospitalName
                    });
                } else return res.render('mobile/mDoctors', {
                    doctor: doctor,
                    departmentid: departmentId,
                    hospitalid: hospitalId,
                    datenum:dateNum,
                    username: username,
                    title: title,
                    hospital_name:hospitalName
                });
            }));
        });

    }
};

/**
 * 显示可预约时间
 * @param req
 * @param res
 * @param next
 * TODO:通过hospitalId,departmentId,doctorId查找可预约时间
 *
 */
exports.showTime = function (req, res, next) {
    var username = req.cookies.username;
    var departmentId = req.query.departmentid;
    var hospitalId = req.query.hospitalid;
    var doctorId = req.query.doctorid;
    var dateNum = parseInt(req.query.datenum);
    var today = new Date();
    var weekOfTomorrow = today.getDay() + 1;
    console.log('department:' + departmentId + ' hospital:' + hospitalId + ' doctor:' + doctorId);
    var proxy = new eventproxy();
    proxy.fail(next);

    var query = {_id:doctorId};
    var opt = {};
    var list = new Array();
    var i = 0;
    Doctor.getDoctorByQuery(query, opt, proxy.done('doctor',function(doctor){
        console.log(doctor);
        console.log(doctor[0].doctor_name);
        if (dateNum == -1) {
            for(var j = 0; j < doctor[0].doctor_visit.length; j++){
                if(doctor[0].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].totalSource > 0){
                    list[i++] = {
                        source : doctor[0].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].leftSource,
                        time : tool.getDateByNum(j) + doctor[0].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].visit_start_time + '~' + doctor[0].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].visit_end_time,
                        fee : doctor[0].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].fee,
                        available : doctor[0].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].leftSource == 0 ? 'cannotBeOrdered' : 'canBeOrdered',
                        datenum : j
                    }
                }
            }
        } else {
            console.log(dateNum);
            list[i] = {
                time: tool.getDateByNum(dateNum) + doctor[0].doctor_visit[(2*weekOfTomorrow+dateNum<14)?(2*weekOfTomorrow+dateNum):(2*weekOfTomorrow+dateNum-14)].visit_start_time + '~' + doctor[0].doctor_visit[(2*weekOfTomorrow+dateNum<14)?(2*weekOfTomorrow+dateNum):(2*weekOfTomorrow+dateNum-14)].visit_end_time,
                source: doctor[0].doctor_visit[(2*weekOfTomorrow+dateNum<14)?(2*weekOfTomorrow+dateNum):(2*weekOfTomorrow+dateNum-14)].leftSource,
                fee: doctor[0].doctor_visit[(2*weekOfTomorrow+dateNum<14)?(2*weekOfTomorrow+dateNum):(2*weekOfTomorrow+dateNum-14)].fee,
                available : doctor[0].doctor_visit[(2*weekOfTomorrow+dateNum<14)?(2*weekOfTomorrow+dateNum):(2*weekOfTomorrow+dateNum-14)].leftSource == 0 ? 'cannotBeOrdered' : 'canBeOrdered',
                datenum:dateNum
            };
        }
        currPage(req, res);
        var title = '选择看病日期';
        if(dateNum != -1)
            title += '(限定时间为' + tool.getDateByNum(dateNum) + (dateNum % 2 == 0 ? '上' : '下') + '午)';
        if (tool.getDeviceType(req.url)) {
            return res.render('mobile/mDatePicker', {
                list: list,
                departmentid: departmentId,
                hospitalid: hospitalId,
                doctorid: doctorId,
                username: username,
                title: title
            });
        } else {
            return res.render('pc/choose_date', {
                list: list,
                departmentid: departmentId,
                hospitalid: hospitalId,
                doctorid: doctorId,
                username: username,
                title: title
            });
        }
    }));

    //var time = new Array();
    //for (var i = 0; i < 5; i++) {
    //    time[i] = {
    //        canBeOrdered: 'canBeOrdered',//这里指该时段是否有号源剩余有则为'canBeOrdered',否则为'cannotBeOrdered',可预约的框框背景为蓝色,不可预约的为红色
    //        date: '2014-11-1' + i,
    //        weekOfTomorrow: '星期x',
    //        time: '10:00-12:00',
    //        source: '1' + i + '/50'
    //    }
    //}

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
    var time = req.query.time;
    var dateNum = parseInt(req.query.datenum);
    var today = new Date();
    var weekOfTomorrow = today.getDay() + 1;
    var proxy = new eventproxy();
    proxy.fail(next);
    proxy.all('hospital','doctor',function(hospital,doctor){
        var dept;
        console.log(hospital);
        console.log(doctor);
        for(var i = 0; i < hospital.hospital_dept.length; i++)
            if(hospital.hospital_dept[i]._id == departmentId){
                dept = hospital.hospital_dept[i].dept_name;
                break;
            }
        console.log(2*weekOfTomorrow+dateNum);
        var order = {
            hospital: hospital.hospital_name,
            dept: dept,
            doctor: doctor[0].doctor_name,
            see_time: time,
            fee: doctor[0].doctor_visit[(2*weekOfTomorrow+dateNum<14)?(2*weekOfTomorrow+dateNum):(2*weekOfTomorrow+dateNum-14)].fee,
            address: hospital.hospital_location,
            tel: hospital.hospital_tel
        }
        if (!tool.getDeviceType(req.url)) {
            res.render('pc/confirm_order', {
                username: username, title: '确认订单信息', order: order, departmentid: departmentId,
                hospitalid: hospitalId,
                doctorid: doctorId, time: time,
                datenum:dateNum
            });
        } else res.render('mobile/mOrder', {
            username: username, title: '确认订单信息', order: order, departmentid: departmentId,
            hospitalid: hospitalId,
            doctorid: doctorId,  time: time,
            datenum:dateNum
        });
    });
    Hospital.getOneHospitalByQuery({_id:hospitalId},{},function(err,hospital){
       proxy.emit('hospital',hospital);
    });
    Doctor.getDoctorByQuery({_id:doctorId},{},function(err,doctor){
        proxy.emit('doctor',doctor);
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
    var userId = req.cookies.user_id;
    var time = req.query.time;
    var dateNum = parseInt(req.query.datenum);
    console.log(userId +" "+ hospitalId + " " + departmentId + " " + doctorId + " " + time + " " + dateNum);
    Order.newAndSaveOrder(hospitalId, departmentId, doctorId, userId, time, dateNum,function (order, err) {
        if (tool.getDeviceType(req.url))
            res.render('mobile/mOrderConfirm', {username: username, title: '订单完成'});
        else {
            res.render('pc/pay_successfully', {username: username, title: '订单完成'});
        }

    });

};

exports.showDepartmentList = function (req, res) {
    var username = req.cookies.username;
    console.log(1);
    if (tool.getDeviceType(req.url))
        res.render('mobile/mDepartmentList', {username: username, title: '科室列表'})
    else
        res.render('pc/findby_department', {username: username, title: '科室列表'});
};
exports.showDiseases = function (req, res) {
    var username = req.cookies.username;
    if (tool.getDeviceType(req.url))
        res.render('mobile/mDiseases', {username: username, title: '疾病列表'});
    else
        res.render('pc/findby_disease', {username: username, title: '疾病列表'});
};