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
        //Feedback.newAndSave("da wangewqao shangew",1,"548e793995eabe4d1fe99f38",function(err){
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
    var query = {}

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

        console.log(hospitals);
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
        hos_location, hos_tel, hos_weight, function (err) {
            if (err)
                return next(err);
            console.log("save hospital successfully");
            res.redirect('/admin/hosInfo');
        });

}



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
    console.log(dept_id);
    var limit = config.page_limit;

    var proxy = new eventproxy();
    proxy.fail(next);

    Hospital.getDeptDotctors(dept_id, proxy.done('hospital', function (hospital) {
        return hospital;
    }));


    proxy.all('hospital', function (hospital) {
        res.render('administrator/docInfo', {
            page: 1,
            pages: 1,
            hospital: hospital
        });
    });

};

exports.callInfo = function (req, res, next) {
    res.render('administrator/callInfo');

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

