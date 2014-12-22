/**
 * Created by steve on 14-12-14.
 * 处理搜索逻辑
 */

var tool = require('../middlewares/tool');

exports.handleSearch = function(req,res,next) {
    var searchText = req.body.searchText;
    var username = req.cookies.username;
    console.log(searchText);
    if (tool.getDeviceType(req.url))
        res.render('mobile/mSearchResult',{username:username});
    else
        res.render('pc/search_hospital',{username:username});
};