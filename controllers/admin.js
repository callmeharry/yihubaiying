/**
 * Created by root on 14-12-8.
 */

var validator = require('validator');
var eventproxy = require('eventproxy');
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
        ep.emit('login_err', '')
        return;
    }

    if (name === 'admin' && password === '123') {
        res.redirect('/admin/index');
    }

};

exports.adminIndex = function (req, res) {

    res.render('administrator/callInfo');
};
