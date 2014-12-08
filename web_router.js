/**
 * Created by steve on 14-12-1.
 * 医呼百应:路由控制
 */
var express = require('express');
var smsTest = require('./test/sms_test');
var getpost = require('./test/getpost');
var mobileRegister = require('./controllers/register');
var admin = require('./controllers/admin');
var mobileLogin = require('./controllers/login');
var router = express.Router();


//get controllers
var index = require('./test/index');
var user = require('./test/users');

//Home page
router.get('/', index);

//Mobile register page
router.get('/mobile_register', mobileRegister.showRegister);
router.post('/mobile_generate_auth_code', mobileRegister.generateAuthCode);
router.post('/mobile_register', mobileRegister.doRegister);

//Mobile login page
router.get('/mobile_login', mobileLogin.showLogin);
router.post('/mobile_login', mobileLogin.handleLogin);

//Test page
router.get('/sms-test', smsTest.registerVerity);
router.post('/pay',getpost.do);

/**
 * Administrator pages
 */

router.get('/admin_login', admin.showAdminLogin);
router.post('/admin_login', admin.adminLogin);
router.get('/admin/index', admin.adminIndex);


module.exports = router;