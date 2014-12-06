/**
 * Created by steve on 14-12-5.
 * 测试ejs中include使用
 */

exports.do= function(req,res){
    var c = 'mm';
    res.render('test/test',{error:c,filename:"test_include.html"});
}
