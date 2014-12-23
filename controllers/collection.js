/**
 * Created by steve on 14-12-23.
 */

var User = require('../proxy/user');
exports.changeHospitalCollectionState = function(req,res,next){
    var user_id = req.body.user_id;
    var hospital_id = req.body.hospital_id;
    var todo = req.body.todo;
    if(todo == '收藏'){
        User.updateByQuery({_id:user_id},{'$push':{"hospital_id":hospital_id}},function(err,user){
            res.send({status:0});
        });
    }else{
        User.updateByQuery({_id:user_id},{'$pull':hospital_id},function(err,user){
            res.send({status:0});
        });
    }
};
exports.changeHospitalCollectionState = function(req,res,next){
    var user_id = req.body.user_id;
    var hospital_name = req.body.hospital_name;
    var doctor_id = req.body.doctor_id;
    var todo = req.body.todo;
    if(todo == '收藏'){
        User.updateByQuery({_id:user_id},{'$push':hospital_id},function(err,user){
            res.send({status:0});
        });
    }else{
        User.updateByQuery({_id:user_id},{'$pull':hospital_id},function(err,user){
            res.send({status:0});
        })
    }
};