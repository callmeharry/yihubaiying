/**
 * Created by steve on 14-12-4.
 */

var validator = require('validator');
var randomNum;
exports.showRegister = function (req, res){
    console.log('mobile_register');
    randomNum="";
    for(var i=0;i<6;i++)
    {
        randomNum+=Math.floor(Math.random()*10);
    }
    console.log(randomNum);
    res.render('mobile/mRegister');
}

exports.doRegister = function(req, res, next) {
    var mobileNumber = validator.trim(req.body.mobile);
    var socialNumber = validator.trim(req.body.social_number);
    var password = validator.trim(req.body.password);
    var city = validator.trim(req.body.city);
    var name = validator.trim(req.body.name);
    var authCode = validator.trim(req.body.auth_code);
    console.log(mobileNumber);
    console.log(socialNumber);
    console.log(password);
    console.log(city);
    console.log(name);
    console.log(authCode);
    if(!authCode === randomNum){
        res.send('error');
    }
    else{
        res.send('success');
    }
}

