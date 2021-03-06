var Q = require('q'),
    os = require('os'),
    rimraf = require('rimraf'),
    prepareAction = require('../../prepare'),
    buildAction = require('../../build'),
    settings = require('../../../lib/settings');

var copyOutput = function (cordova_www, project_output, verbose) {
    var defer = Q.defer();
    rimraf(cordova_www, function (err) {
        if(err) return defer.reject(err);
        if(verbose) print.success('rm cordova www folder');
        defer.resolve();
    }, function (err) { defer.reject(err); });

    return defer.promise.then(function () {
        return prepareAction.copy_method(cordova_www, project_output);
    });
};

module.exports = function prepare(www, out, localSettings, platform, config, verbose) {
    var copy_method = settings.www_link_method[os.platform()],
        copyPromise = (copy_method === 'copy') ? copyOutput(www, out) : Q.resolve();

    return copyPromise.then(function () {
        return buildAction.prepare({
            localSettings: localSettings,
            platform : platform,
            configuration: config,
            verbose: verbose
        });
    });
};
