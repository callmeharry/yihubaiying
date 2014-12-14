/**
 * Created by root on 14-12-8.
 */

var validator = require('validator');
var eventproxy = require('eventproxy');
var Hospital = require('../proxy').Hospital;
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
        console.log(pages + " " + page);
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
 *  //todo not test yet no redirect page
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


    var ep = new eventproxy();
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
            res.redirect('admin/save_success');
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

exports.deptInfo = function (req, res, next) {
    res.render('administrator/deptInfo');
};


exports.docInfo = function (req, res, next) {
    res.render('administrator/docInfo');
};

exports.callInfo = function (req, res, next) {
    res.render('administrator/callInfo');

};

exports.userInfo = function (req, res, next) {


    res.render('administrator/userInfo');
};

exports.exceptionManage = function (req, res, next) {

    res.render('administrator/exceptionManage');
};

exports.hosFeedback = function (req, res, next) {

    res.render('administrator/hosFeedback.html');
};

exports.userFeedback = function (req, res, next) {
    res.render('administrator/userFeedback.html');
};






