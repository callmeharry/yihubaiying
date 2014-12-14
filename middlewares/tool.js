/**
 * Created by steve on 14-12-14.
 * Tool file
 */

exports.setCurrentPage = function (req, res) {
    res.cookie(config.current_page, req.url, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30});
}