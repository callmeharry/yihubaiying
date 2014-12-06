/**
 * Created by steve on 14-12-1.
 * 医呼百应:路由控制
 */


var express = require('express');
var sms_test = require('./test/sms_test');
var com = require('./test/com');
var getpost = require('./test/getpost')
var router = express.Router();


//get controllers
var index = require('./test/index');
var user = require('./test/users');

//Home page
router.get('/', index);
router.get('/', user);

router.get('/sms-test',sms_test.registerVerity);
router.get('/com',com.do);
router.post('/pay',getpost.do);


module.exports = router;