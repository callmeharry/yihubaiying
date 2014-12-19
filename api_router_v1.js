/**
 * Created by Megas on 2014/12/16.
 * 为医院提供API
 */

var express = require('express');
var router = express.Router();

var hospitalController = require('./api/v1/hospital');
var orderController = require('./api/v1/order');

router.get('/hospital/:id', hospitalController.showHospitalInfo);
router.post('/hospital/:id/update', hospitalController.updateHospitalBicInfo);
router.post('/hospital/:id/dept_id', hospitalController.updateHospitalDeptInfo);
router.post('hospital/:id/remove', hospitalController.removeHospitalInfo);
router.post('hospital/:id/dept_id/doc_id', hospitalController.removeDocFromDept);
router.post('hospital/:id/dept_id/doc_id/add', hospitalController.addDocToDept);
router.get('/orders', orderController.getOrderInfo);

module.exports = router;