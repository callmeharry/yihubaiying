/**
 * Created by steve on 14-12-14.
 * 处理搜索逻辑
 */

var tool = require('../middlewares/tool');
var Doctor = require('../proxy').Doctor;
var Hospital = require('../proxy').Hospital;
var eventproxy = require('eventproxy');

exports.handleSearch = function(req,res,next) {
    var searchText = req.body.searchText;
    var username = req.cookies.username;
    var city = req.cookies.city;
    var proxy = new eventproxy();
    proxy.fail(next);
    proxy.all('hospital','doctor',function(hospital,doctor){
        console.log(doctor);
        console.log(hospital);
        if (tool.getDeviceType(req.url))
            res.render('mobile/mSearchResult',{username:username,doctor:doctor,hospital:hospital,searchtext:searchText,title:"\"" + searchText + "\"的搜索结果"});
        else
            res.render('pc/search_hospital',{username:username,doctor:doctor,hospital:hospital,searchtext:searchText});
    });
    var doctorQuery = {};
    doctorQuery['doctor_advanced_illness_name'] = new RegExp(searchText.toString());
    Doctor.getDoctorByQuery(doctorQuery,{},function(err,doctors){
        var doctor = new Array();
        var today = new Date();
        var weekOfTomorrow = today.getDay() + 1;

        var i;
        for(i = 0; i < doctors.length;) {
            var m = i;
            Hospital.getHospitalsByQuery({"hospital_dept.dept_doc":doctors[m]._id},{},function(err, hospitals2){
            var hospital_id = hospitals2[0]._id;
                var hospital_name = hospitals2[0].hospital_name;
                var department_id;

                for(var n = 0;n < hospitals2[0].hospital_dept.length;n++){
                    for(var o = 0; o < hospitals2[0].hospital_dept[n].dept_doc.length; o++){
                        if(hospitals2[0].hospital_dept[n].dept_doc[o].toString() == doctors[m]._id.toString()){
                            department_id = hospitals2[0].hospital_dept[n]._id;
                        }
                    }
                }
                var flag = '否';//not on duty
                var timeAndSource = new Array();
                var k = 0;
                console.log(m);
                for(var j = 0; j < doctors[m].doctor_visit.length; j++){
                    if(doctors[m].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].totalSource != '0') {
                        flag = '是';
                        timeAndSource[k++] = {
                            time : tool.getDateByNum(j) + doctors[m].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].visit_start_time + ' ~ ' + doctors[m].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].visit_end_time,
                            source: doctors[m].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].leftSource + '/' + doctors[m].doctor_visit[(2*weekOfTomorrow+j<14)?(2*weekOfTomorrow+j):(2*weekOfTomorrow+j-14)].totalSource
                        }
                    }
                }
                if(flag == '否')
                    timeAndSource = {
                        time:'无',
                        source:''
                    };
                console.log(m+" " + doctors[m]);
                doctor[m] = {
                    name:doctors[m].doctor_name,
                    imgsrc:null, //TODO
                    isOnDuty:flag,
                    timeAndSource:timeAndSource,
                    goodReputation:doctors[m].doctor_good_reputation,
                    intro:doctors[m].doctor_intro,
                    advancedDisease:doctors[m].doctor_advanced_illness_name,
                    _id:doctors[m]._id,
                    hospitalid:hospital_id,
                    departmentid:department_id,
                    hospital_name:hospital_name
                };

        });

            i++;
        }

       proxy.emit('doctor',doctor);


        var hospitalRegExp = new RegExp(searchText.toString());
        var hospitalQuery = {"$or":[{hospital_name:hospitalRegExp},{"hospital_dept.dept_name":hospitalRegExp}]};
        Hospital.getHospitalsByQuery(hospitalQuery,{},function(err,hospitals){
            proxy.emit('hospital',hospitals);
        });
    });

};