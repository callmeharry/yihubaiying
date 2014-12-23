/**
 * Created by steve on 14-12-23.
 */

var User = require('../proxy/user');
var validator = require('validator');

exports.changeHospitalCollectionState = function(req,res,next){

    var user =req.session.user;
    console.log("hehe!!");
    var user_id = req.body.user_id;
    var hospital_id = req.body.hospital_id;
    var todo = req.body.todo;
    if(todo == '收藏'){
        //user.favourite_hospital.push(hospital_id);
        //console.log("hehe!!");
        //user.save(function(err){
        //    if(err) console.log("hehe");
        //    console.log("yes11");
        //    res.send({status:0});
        //});


        User.updateByQuery({_id:user_id},{'$push':{"favourite_hospital":hospital_id}},function(err){
            if(err)console.log(err);
            res.send({status:0});
        });
    }else{
        User.updateByQuery({_id:user_id},{'$pull':{"favourite_hospital":hospital_id}},function(err){
            if(err) console.log("12345");
            res.send({status:0});
        });
    }
};
exports.changeDoctorCollectionState = function(req,res,next){
    var user_id = req.body.user_id;
    var hospital_name = req.body.hospital_name;
    var doctor_id = req.body.doctor_id;
    var todo = req.body.todo;
    console.log(user_id + " " + hospital_name + " " + doctor_id + " " + todo);
    if(todo == '收藏'){
        User.updateByQuery({_id:user_id},{'$push':{"favourite_doctor":{"hospital":hospital_name,"doctor_id":doctor_id}}},function(err){
            if(err)console.log(err);
            res.send({status:0});
        });
    }else{
        User.updateByQuery({_id:user_id},{'$pull':{"favourite_doctor":{"hospital":hospital_name,"doctor_id":doctor_id}}},function(err){
            if(err)console.log(err);
            res.send({status:0});
        })
    }
};