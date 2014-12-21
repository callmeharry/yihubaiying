/**
 * Created by Megas on 2014/12/16.
 * 为医院提供API
 */

var express = require('express');
var router = express.Router();

var hospitalController = require('./api/v1/hospital');
var orderController = require('./api/v1/order');

router.get('/hospital', hospitalController.showHospitalInfo);
router.post('/hospital/update', hospitalController.updateHospitalBicInfo);
router.post('/hospital/update/dept', hospitalController.updateHospitalDeptInfo);
router.post('hospital/removeDoc', hospitalController.removeDocFromDept);
router.post('hospital/addDoc', hospitalController.addDocToDept);
router.get('/orders', orderController.getOrderInfo);
router.post('/orders/confirm', orderController.confirmOrder);

module.exports = router;