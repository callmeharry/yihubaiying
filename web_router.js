/**
 * Created by steve on 14-12-1.
 * 医呼百应:路由控制
 */
var express = require('express');
var smsTest = require('./test/sms_test');
var getpost = require('./test/getpost');
var mobileBook = require('./controllers/book');
var mobileRegister = require('./controllers/register');
var admin = require('./controllers/admin');
var mobileLogin = require('./controllers/login');
var mobileIndex = require('./controllers/site');
var router = express.Router();


//get controllers
var index = require('./test/index');
var user = require('./test/users');

//Home page
router.get('/', index);

//Mobile home page
router.get('/mobile', mobileIndex.showIndex);//show mobile index page

//Mobile register page
router.get('/mobile/register', mobileRegister.showRegister);//show mobile register page
router.post('/mobile/generateAuthCode', mobileRegister.generateAuthCode);//generate a 6-digit auth code
router.post('/mobile/register', mobileRegister.handleRegister);//handle register info

//Mobile login page
router.get('/mobile_login', mobileLogin.showLogin);
router.post('/mobile_login', mobileLogin.handleLogin);

//Book page
router.get('/mobile/book/hospitals', mobileBook.showHospital);
router.get('/mobile/book/hospitals/departments', mobileBook.showDepartment);

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