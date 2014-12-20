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
var mobileLoginLogout = require('./controllers/loginlogout');
var user  =require('./controllers/user');
var mobileIndex = require('./controllers/site');
var router = express.Router();
var sms = require('./middlewares/sms');
var include = require('./test/test_include');
var auth = require('./middlewares/auth');
//get controllers
var index = require('./test/index');


//Mobile home page
router.get('/mobile', mobileIndex.showIndex);//show mobile index page

//Mobile register page
router.get('/mobile/register', mobileRegister.showRegister);//show mobile register page
router.post('/mobile/generateAuthCode', mobileRegister.getAuthCode);//generate a 6-digit auth code
router.post('/mobile/register', mobileRegister.handleRegister);//handle register info

//Mobile login logout page
router.get('/mobile/login', mobileLoginLogout.showLogin);
router.post('/mobile/generateAuthCodeL', mobileLoginLogout.getAuthCode);
router.post('/mobile/login', mobileLoginLogout.handleLogin);
router.get('/mobile/logout', mobileLoginLogout.handleLogout);

//Mobile Book page
router.get('/mobile/book/hospitals', mobileBook.showHospital);
router.get('/mobile/book/departments', mobileBook.showDepartment);
router.get('/mobile/book/doctors', mobileBook.showDoctor);
router.get('/mobile/book/time', mobileBook.showTime);
router.get('/mobile/book/confirmbook', mobileBook.confirmBook);
router.get('/mobile/book/finishbook', mobileBook.finishBook);
router.get('/mobile/book/diseases', mobileBook.showDiseases);
router.get('/mobile/book/departmentlist', mobileBook.showDepartmentList);

//PC Home page
router.get('/', mobileIndex.showIndex);

//PC register page
router.get('/register', mobileRegister.showRegister);//show pc register page
router.post('/mobile/generateAuthCode', mobileRegister.getAuthCode);//generate a 6-digit auth code
router.post('/register', mobileRegister.handleRegister);//handle register info

//pc login logout page
router.get('/login', mobileLoginLogout.showLogin);
router.post('/mobile/generateAuthCodeL', mobileLoginLogout.getAuthCode);
router.post('/login', mobileLoginLogout.handleLogin);
router.get('/logout', mobileLoginLogout.handleLogout);

//PC personal center
router.get('/personalCenter/personInfo',auth.UserRequired, user.showPersonInfo);


//pc book page
router.get('/book/hospitals', mobileBook.showHospital);
router.get('/book/departments', mobileBook.showDepartment);
router.get('/book/doctors', mobileBook.showDoctor);
router.get('/book/time', mobileBook.showTime);
router.get('/book/confirmbook', mobileBook.confirmBook);
router.get('/book/finishbook', mobileBook.finishBook);
router.get('/book/diseases', mobileBook.showDiseases);
router.get('/book/departmentlist', mobileBook.showDepartmentList);
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
router.post('/admin/hosAdd', admin.addHos);

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


//Ajax from admin
router.post('/admin/newDept',admin.addDeptInter);
router.post('/admin/modifyHos',admin.modifyHosInter);
router.post('/admin/dropHos',admin.dropHosInter);
router.post('/admin/modifyDept',admin.modifyDept);
router.post('/admin/dropDept',admin.dropDept);
router.post('/admin/addDoctor',admin.addDoctorInter);
router.post('/admin/modifyDoc',admin.modifyDocInter);
router.post('/admin/dropDoctor',admin.dropDoctorInter);
router.post('/admin/replyFeedback',admin.replyFeedbackInter);
router.post('/admin/modifyUser',admin.modifyUser);
router.post('/admin/deleteUser',admin.deleteUser);
router.post('/admin/modifyDocVisit',admin.modifyDocVisitIntern);
router.post('/admin/addDocVisit',admin.addDocVisitIntern);

//Test page
router.get('/sms-test', smsTest.registerVerity);
router.post('/pay', getpost.do);
router.get('/sms', sms.registerVerify);
router.get('/include-test', include.do);

module.exports = router;