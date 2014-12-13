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
router.post('/mobile/generateAuthCode', mobileRegister.getAuthCode);//generate a 6-digit auth code
router.post('/mobile/register', mobileRegister.handleRegister);//handle register info

//Mobile login page
router.get('/mobile/login', mobileLogin.showLogin);
router.post('/mobile/generateAuthCodeL', mobileLogin.getAuthCode);
router.post('/mobile/login', mobileLogin.handleLogin);

//Book page
router.get('/mobile/book/hospitals', mobileBook.showHospital);
router.get('/mobile/book/departments', mobileBook.showDepartment);
router.get('/mobile/book/doctors', mobileBook.showDoctor);
router.get('/mobile/book/time', mobileBook.showTime);
router.get('/mobile/book/finishbook', mobileBook.finishBook);



/**
 * Administrator pages
 */

router.get('/admin_login', admin.showAdminLogin);
router.post('/admin_login', admin.adminLogin);

//医院信息
router.get('/admin/hosInfo', admin.hosInfo);
//医院反馈
router.get('/admin/hosFeedback', admin.hosFeedback);
//医院添加
router.get('/admin/hosAdd', admin.showAddHos);
router.post('admin/hostAdd', admin.addHos);

//医院端修改
router.get('/admin/hosAlter', admin.changeHosInfo);

//科室信息
router.get('/admin/deptInfo', admin.deptInfo);
//医生信息
router.get('/admin/docInfo', admin.docInfo);
//出诊信息
router.get('/admin/callInfo', admin.callInfo);
//用户反馈
router.get('/admin/userFeedback', admin.userFeedback);
//用户信息
router.get('/admin/userInfo', admin.userInfo);

//异常信息
router.get('/admin/exceptionManage', admin.exceptionManage);


//Test page
router.get('/sms-test', smsTest.registerVerity);
router.post('/pay', getpost.do);


module.exports = router;