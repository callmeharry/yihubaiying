/**
 * Created by Megas on 2014/12/9.
 * 与illness对应，用于提供数据
 */

var models = require('../models');
var Illness = models.Illness;

exports.newAndSaveIllness = function (illName, illDescribe, illCause, illTheory, illCheck, illSecMethod, callback) {
    var illness = new Illness({
        ill_name: illName,
        ill_describe: illDescribe,
        ill_cause: illCause,
        ill_theory: illTheory,
        ill_check: illCheck,
        ill_secure_method: illSecMethod
    });
    illness.save(callback);
};

exports.addRecomDoc = function (illId, docId, callback) {
    Illness.update({_id: illId}, {$push: {recommend_doc: docId}}, callback);
};

exports.addRecomHos = function (illId, hosId, callback) {
    Illness.update({_id: illId}, {$push: {recommend_hos: hosId}}, callback);
};
