/**
 * Created by steve on 14-12-4.
 * yihubaiying register page
 */

var user = require('../proxy/user');
var randomNum = "";// 验证码
var tool = require('../middlewares/tool');
var authMiddleWare = require('../middlewares/auth');
/**
 * 显示注册页面
 * @param req
 * @param res
 */
exports.showRegister = function (req, res) {
    console.log('register');
    if (tool.getDeviceType(req.url))
        res.render('mobile/mRegister', {title: '医呼百应:注册', error:''});
    else
        res.render('pc/register', {error:''});
};

/**
 * 获取验证码
 */
exports.getAuthCode = function () {
    //authMiddleWare.genAuthCode();
    randomNum = '';
    for (var i = 0; i < 6; ++i) {
        randomNum += Math.floor(Math.random() * 10);
    }
    console.log(randomNum);
};

exports.handleRegister = function (req, res, next) {
    var phoneNumber = req.body.phoneNumber;
    var socialNumber = req.body.social_number;
    var password = req.body.password;
    var city = req.body.city;
    var name = req.body.name;
    var authCode = req.body.auth_code;
    var realAuthCode = global.authCode;

    console.log(phoneNumber);
    console.log(global.authCode);
    if (!(authCode == realAuthCode)) {
        if (tool.getDeviceType(req.url))
            res.render('mobile/mRegister', {title: '医呼百应:注册', error:'验证码错误'});
        else
            res.render('pc/register', {error:'验证码错误'});
        return;
    }
    user.getOneUserByPhoneNumber(phoneNumber, function (err, users) {
        if (users != null) {
            if (tool.getDeviceType(req.url))
                res.render('mobile/mRegister', {title: '医呼百应:注册', error:'此电话号码(' +phoneNumber + ')已被使用'});
            else
                res.render('pc/register', {error:'此电话号码(' +phoneNumber + ')已被使用'});
            return;
        }
        user.getUserByQuery({social_number:socialNumber},{},function(err, users2){
           if(users2[0] != null){
               if (tool.getDeviceType(req.url))
                   res.render('mobile/mRegister', {title: '医呼百应:注册', error:'此身份证号码(' + socialNumber + ')已被使用'});
               else
                   res.render('pc/register', {error:'此身份证号码(' + socialNumber + ')已被使用'});
               return;
           }
            user.newAndSave(phoneNumber, socialNumber, password, city, name, function (err, verifiedUser) {
                if (err) {
                    next();
                    return;
                }
                authMiddleWare.genSession(verifiedUser, req, res);
                if (tool.getDeviceType(req.url))
                    return res.redirect('/mobile');
                else
                    return res.redirect('/');
            });
        });
    });
};

