/**
 * Created by root on 14-12-8.
 */
var validator = require('validator');
var eventproxy = require('eventproxy');
var Hospital = require('../proxy').Hospital;
var User = require('../proxy').User;
var Doctor = require('../proxy').Doctor;
var Feedback = require('../proxy').Feedback;
var config = require('../config');
/**
 * show Admin Login info
 * @param req
 * @param res
 */
exports.showAdminLogin = function (req, res) {
    res.render('administrator/adminLogin');
};

/**
 * login Admin page
 * @param req
 * @param res
 */
exports.adminLogin = function (req, res, next) {

    var name = validator.trim(req.body.name);
    var password = validator.trim(req.body.password);

    var ep = new eventproxy();
    ep.fail(next);

    ep.on('login_err', function (msg) {
        res.status(422);
        res.render('administrator/adminLogin', {error: msg, name: name, password: password});
    });

    if (!name || !password) {
        ep.emit('login_err', 'name or password is too short!');
        return;
    }

    if (name === 'admin' && password === '123') {


        /*
         Hospital.newHospital("北京市朝阳医院","so!",'beijing','beijing chaoyangqu shenjingbingyuan ','123','100',function(err){
         if(err){
         return next(err);
         }

         console.log("success! save in the Mongo");

         });
         */
        //
        //Feedback.newAndSave("撒大声地发发舒服",1,"548d317ef66b6e081343d247",function(err){
        //    if(err){
        //        next(err);
        //    }
        //    console.log("success!");
        //    res.redirect('/admin/hosInfo');
        //
        //});

        //Hospital.addDepartment("548ee6df7e901dae494e699b","shenjingke","ertongshenjing",function(err){
        //    if(err){next(err)};
        //    console.log("success");
        //    res.redirect('/admin/hosInfo');
        //});

        //Doctor.newAndSaveDoctor("548ee73b19e1d59f4a7b3ffa","hehed shenkjing","shengjinga !","shenjing/hehaa/dad/",function(err){
        //    if(err) return next(err);
        //
        //});
        res.redirect('/admin/hosInfo');

    } else {
        ep.emit('login_err', "username or password is wrong!");
        return;
    }


};

/**
 * show hospital info
 * @param req
 * @param res
 * @param next
 */
exports.hosInfo = function (req, res, next) {

    var page = parseInt(req.query.page, 10) || 1;
    var limit = config.page_limit;
    var query = {};

    var proxy = new eventproxy();
    proxy.fail(next);

    //get hospital counts
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

        res.render('administrator/hosInfo', {
            page: page,
            pages: pages,
            hospitals: hospitals
        });

    });
};

/**
 *show add hospital
 * @param req
 * @param res
 * @param next
 */
exports.showAddHos = function (req, res, next) {
    res.render('administrator/hosAdd');
};
/**
 *  add hospital
 * @param req
 * @param res
 * @param next
 */
exports.addHos = function (req, res, next) {
    var hos_name = validator.trim(req.body.hos_name);
    var hos_intro = validator.trim(req.body.hos_intro);
    var hos_city = validator.trim(req.body.hos_city);
    var hos_location = validator.trim(req.body.hos_location);
    var hos_tel = validator.trim(req.body.hos_tel);
    var hos_weight = validator.trim(req.body.hos_weight);

    if(req.files.hos_img.name)
        var hos_img=  "/uploads/"+ req.files.hos_img.name;
    else
        hos_img = "/images/defaultHos.jpg";

    console.log(hos_name + " " + hos_intro + " " + hos_city + " " + hos_location + " hehe");

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('post_err', function (msg) {
        res.status(422);
        res.render('administrator/hosAdd', {error: msg});
    });


    if (!hos_name || !hos_intro || !hos_city || !hos_location || !hos_weight) {
        ep.emit('post_err', "the information is not complete!");
        return;
    }

    Hospital.newHospital(hos_name, hos_intro, hos_city,
        hos_location, hos_tel, hos_weight,hos_img, function (err) {
            if (err)
                return next(err);
            console.log("save hospital successfully");
            res.redirect('/admin/hosInfo');
        });

};



/**
 * change hospitalinfo
 * @param req
 * @param res
 * @param next
 */
exports.changeHosInfo = function (req, res, next) {

    res.render('administrator/hosAlter');
};

/**
 * redirect from hosInfo and show the detail dept Info
 * @param req
 * @param res
 * @param next
 */
exports.deptInfo = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    //hos_id

    var hos_id = validator.trim(req.query.hos_id) || req.session.hosId || '';
    req.session.hosId = hos_id;

    console.log(hos_id);

    var query = {_id: hos_id};
    var limit = config.page_limit;
    var options = {"hospital_dept": {"$slice": [(page - 1) * limit, limit]}};

    var proxy = new eventproxy();
    proxy.fail(next);

    //get fill hospital and dept
    Hospital.getOneHospitalByQuery(query, options, proxy.done("hospital", function (hospital) {
        req.session.hosName = hospital.hospital_name;
        return hospital;
    }));

    //get pages; you should optimize the function to let it faster
    Hospital.getOneHospitalByQuery(query, {}, proxy.done(function (hospital) {
        var pages = Math.ceil(hospital.hospital_dept.length / limit);
        proxy.emit("pages", pages);
    }));

    proxy.all("pages", "hospital", function (pages, hospital) {
        console.log(pages + " " + hospital);

        res.render("administrator/deptInfo", {
            pages: pages,
            page: page,
            hospital: hospital
        });

    });

};


exports.docInfo = function (req, res, next) {
    var page = validator.trim(req.query.page);
    page = page > 0 ? page : 1;

    //dept_id
    var dept_id = validator.trim(req.query.dept_id) || req.session.dept_id || '';
    req.session.dept_id = dept_id;
    console.log(dept_id+ "test!");
    var limit = config.page_limit;

    var proxy = new eventproxy();
    proxy.fail(next);

    Hospital.getDeptDoctors(dept_id, proxy.done('hospital', function (hospital) {
        req.session.dept_name = hospital.dept_name;
        return hospital;
    }));


    proxy.all('hospital', function (hospital) {
        console.log(hospital);
        res.render('administrator/docInfo', {
            page: 1,
            pages: 1,
            hospital: hospital,
            hospital_name:req.session.hosName
        });
    });

};

exports.callInfo = function (req, res, next) {

    var doc_id = validator.trim(req.query.doc_id);
    var proxy = new eventproxy();
    var hos_id = req.session.hosId;
    var hos_name = req.session.hosName;
    var dept_id = req.session.dept_id;
    var dept_name = req.session.dept_name;


    proxy.fail(next);

    Doctor.getDoctorById(doc_id, proxy.done('doctor', function (doctor) {
        return doctor;
    }));


    proxy.all('doctor', function (doctor) {
        res.render('administrator/callInfo', {
            doctor: doctor,
            page:1,
            pages:1,
            hos_id:hos_id,
            hos_name:hos_name,
            dept_id:dept_id,
            dept_name:dept_name
        })
    });

};

exports.userInfo = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var query = {};
    var limit = config.page_limit;
    var options = {skip: (page - 1) * limit, limit: limit, sort: '-create_date'};

    var proxy = new eventproxy();
    proxy.fail(next);

    //get user numbers
    User.getCountByQuery(query, proxy.done(function (all_user_count) {
        var pages = Math.ceil(all_user_count / limit);
        proxy.emit("pages", pages);
    }));


    //get user infos
    User.getUserByQuery(query, options, proxy.done('users', function (users) {
        return users;
    }));


    proxy.all('users', 'pages', function (users, pages) {
        console.log(users + " " + pages + " " + page);
        res.render('administrator/userInfo', {
            users: users,
            pages: pages,
            page: page
        });
    });
};

exports.exceptionManage = function (req, res, next) {

    res.render('administrator/exceptionManage');
};

exports.hosFeedback = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var limit = config.page_limit;
    var query = {fdType: 2};
    var options = {skip: (page - 1) * limit, limit: limit, sort: "date"};

    var proxy = new eventproxy();
    proxy.fail(next);
    //get pages count
    Feedback.getCountByQuery(query, proxy.done(function (all_hosFeedback_count) {
        var pages = Math.ceil(all_hosFeedback_count / limit);
        proxy.emit('pages', pages);
    }));

    //get hosFeedback
    Feedback.getFeedbackByQuery(query, options, proxy.done('hosFeedback', function (hosFeedback) {

        return hosFeedback;
    }));

    proxy.all('pages', 'hosFeedback', function (pages, hosFeedback) {

        res.render('administrator/hosFeedback', {
            pages: pages,
            page: page,
            feedbacks: hosFeedback
        });
    });

};

exports.userFeedback = function (req, res, next) {
    var page = parseInt(req.query.page, 10) || 1;
    page = page > 0 ? page : 1;
    var query = {fdType: 1};
    var limit = config.page_limit
    var options = {skip: (page - 1) * limit, limit: limit, sort: "date"};

    var proxy = new eventproxy();
    proxy.fail(next);

    //get page count
    Feedback.getCountByQuery(query, proxy.done(function (all_userFeedback_count) {
        var pages = Math.ceil(all_userFeedback_count / limit);
        proxy.emit('pages', pages);
    }));

    //get userFeedback infos
    Feedback.getFeedbackByQuery(query, options, proxy.done('userFeedback', function (userFeedback) {
        return userFeedback;
    }));

    proxy.all('pages', 'userFeedback', function (pages, userFeedback) {

        res.render('administrator/userFeedback', {
            page: page,
            pages: pages,
            feedbacks: userFeedback
        });
    });

};


//Ajax handle function

exports.modifyHosInter = function (req, res, next) {
    var hos_id = validator.trim(req.body.hos_id);
    var hos_name = validator.trim(req.body.hos_name) || '';
    var hos_intro = validator.trim(req.body.hos_intro) || '';
    var hos_city = validator.trim(req.body.hos_city) || '';
    var hos_location = validator.trim(req.body.hos_location) || '';
    var hos_tel = validator.trim(req.body.hos_tel) || '';
    var hos_weight = validator.trim(req.body.hos_weight) || '';
    console.log(req.body);

    var query = {"_id": hos_id};
    var ups = {};
    if (hos_name !== '')
        ups.hospital_name = hos_name;
    if (hos_intro !== '')
        ups.hospital_intro = hos_intro;
    if (hos_city !== '')
        ups.hospital_city = hos_city;
    if (hos_location !== '')
        ups.hospital_location = hos_location;
    if (hos_tel !== '')
        ups.hospital_tel = hos_tel;
    if (hos_weight !== '')
        ups.hospital_weight = hos_weight;


    Hospital.updateDeptByQuery(query, {"$set": ups}, function (err) {
        if (err) return next(err);

        res.send({status: 0});
    });

};

exports.dropHosInter = function (req, res, next) {
    var hos_id = req.body.hos_id;
    console.log(hos_id);
    Hospital.dropHospital({"_id": hos_id}, function (err) {
        if (err) return next(err);
        res.send({"status": 0});
    });

};


/**
 * response from Ajax
 * @param req
 * @param res
 * @param next
 */
exports.addDeptInter = function (req, res, next) {
    var hos_id = validator.trim(req.body.hos_id);
    var dept_name = validator.trim(req.body.dept_name);
    var father_dept_name = validator.trim(req.body.father_dept_name);
    console.log(req.body);
    Hospital.addDepartment(hos_id, father_dept_name, dept_name, function (err) {
        if (err) next(err);
        console.log("success!");
        res.send({status: 0});
    });

};

/**
 * change info of dept
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.modifyDept = function (req, res, next) {
    var dept_id = validator.trim(req.body.dept_id);
    var dept_name = validator.trim(req.body.dept_name)|| '';
    var father_dept_name = validator.trim(req.body.father_dept_name) || '';
    console.log(req.body);

    var query = {"hospital_dept._id": dept_id};
    var ups = {};

    if(dept_name !== '')
        ups["hospital_dept.$.dept_name"] = dept_name;

    if(father_dept_name !== '')
        ups["hospital_dept.$.father_dept_name"] = father_dept_name;


    Hospital.updateDeptByQuery(query, ups, function (err) {
        if (err) return next(err);

        res.send({status: 0});
    });
};
/**
 * drop dept
 * @param req
 * @param res
 * @param next
 */
exports.dropDept = function (req, res, next) {
    var dept_id = validator.trim(req.body.dept_id);
    console.log(dept_id);
    var query = {"hospital_dept._id": dept_id};
    var ups = {"$unset": {"hospital_dept.$._id": dept_id}};
    Hospital.updateDeptByQuery(query, ups, function (err) {

        if (err) return next(err);

        res.send({"status": 0});
    });

};

//add doctorInter

exports.addDoctor = function (req, res, next) {
    var dept_id = req.body.dept_id;
    var doc_name = validator.trim(req.body.doc_name);
    var doc_intro = validator.trim(req.body.doc_intro);
    var good_illness = validator.trim(req.body.good_illness);
    console.log(req.body);
    console.log(req.files);
    if(req.files.doc_img)
        var doc_imgsrc = "/uploads/"+req.files.doc_img.name;
    else
        doc_imgsrc = '/images/docDefault.png';

    Doctor.newAndSaveDoctor(dept_id,doc_name, doc_intro, good_illness,doc_imgsrc, function (err) {
        if (err) return next(err);
        console.log("shhaaa!");
        res.redirect('/admin/docInfo');

    });

};

//modify doctor
exports.modifyDocInter = function(req, res, next){
    var doc_id = validator.trim(req.body.doc_id)||'';
    var doc_name = validator.trim(req.body.doc_name)||'';
    var doc_intro = validator.trim(req.body.doc_intro)||'';
    var good_illness = validator.trim(req.body.good_illness)||'';
    console.log(req.body);
    var query = {_id:doc_id};
    var ups = {};

    if(doc_name !== '' )
        ups.doctor_name = doc_name;

    if(doc_intro !=='')
        ups.doctor_intro = doc_intro;

    if(good_illness !=='')
        ups.doctor_advanced_illness_name = good_illness;

    console.log(ups);
    Doctor.updateDoctorByQuery(query,{"$set":ups},function(err){
        if(err) return res.send({status:1,msg:"未存储成功！"});

        return res.send({status:0});
    });


};

//delete doctor
exports.dropDoctorInter = function(req, res, next){
    var dept_id = validator.trim(req.body.dept_id);
    var doc_id = validator.trim(req.body.doc_id);
    console.log(req.body);
    console.log(dept_id);
    console.log(doc_id);
    Doctor.dropDoctor(dept_id, doc_id,function(err){
        if(err) next(err);
        return res.send({status:0});
    });
}


//change userInfo
exports.modifyUser = function (req, res, next) {
    console.log('test!');
    var user_id = req.body.user_id;
    var user_status = req.body.user_status;
    var credit = req.body.credit||10;
    console.log(req.body);
    var query = {"_id": user_id};
    var ups = {"user_status": user_status,"credit_level":credit};

    User.updateByQuery(query, ups, function (err) {
        if (err) return next(err);
        res.send({"status": 0});
    })

};


exports.deleteUser = function (req, res, next) {
    var user_id = req.body.user_id;
    var query = {"_id": user_id};

    User.dropUser(query, function (err) {
        if (err) return next(err);
        res.send({"status": 0});
    });

};


// reply userFeedback and hosFeedback

exports.replyFeedbackInter = function (req, res, next) {
    var feedback_id = req.body.feedback_id;
    var check_message = req.body.check_message;

    var query = {"_id": feedback_id};
    var ups = {"$set": {"check_message": check_message, "if_check": true}};

    Feedback.replyFeedback(query, ups, function (err) {
        if (err) return next(err);
        res.send({"status": 0});
    });

};


//Add doctor visit time
exports.addDocVisitIntern = function (req, res, next) {
    var doc_id = req.body.doc_id;
    var fee = req.body.fee;
    var visit_start_time = req.body.visit_start_time;
    var visit_end_time = req.body.visit_end_time;
    var totalSource = req.body.totalSource;
    var leftSource = req.body.leftSource;
    console.log(req.body);
    var ups = {
        visit_start_time: visit_start_time,
        visit_end_time: visit_end_time,
        totalSource: totalSource,
        leftSource: leftSource,
        fee: fee
    };
    Doctor.addDoctorVisit(doc_id, ups, function (err) {
        if (err) return res.send({status: -1, msg: "failed"});

        res.send({status: 0});
    });

};

exports.modifyDocVisitIntern = function(req, res, next){
    var visit_id = req.body.visit_id||'';
    var fee = req.body.fee||'';
    var visit_start_time = req.body.visit_start_time||'';
    var visit_end_time=  req.body.visit_end_time||'';
    var totalSource = req.body.totalSource||'';
    var leftSource = req.body.leftSource||'';

    var query = {"doctor_visit._id":visit_id};
    var ups = {};

    if(fee !== '')
        ups['doctor_visit.$.fee'] = fee;

    if(visit_start_time !== '')
        ups['doctor_visit.$.visit_start_time'] = visit_start_time;

    if(visit_end_time !== '')
        ups['doctor_visit.$.visit_end_time'] = visit_end_time;

    if(totalSource !== '')
        ups['doctor_visit.$.totalSource'] = totalSource;

    if(leftSource !== '')
        ups['doctor_visit.$.leftSource'] = totalSource;

    Doctor.updateDoctorByQuery(query, ups, function(err){

        if(err) return res.send({status:-1, msg:"failed"});

        res.send({status:0});
    });

};

exports.showUpload = function(req, res ,next){
    res.render('test/test');
};
var multer = require('multer');

exports.testUpload = function(req, res, next){
    console.log(req.body);
    console.log(req.files);

    res.redirect('/test/upload');
};

