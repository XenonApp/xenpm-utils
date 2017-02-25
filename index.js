'use strict';

const spawn = require('child_process').spawn;
const search = require('npm-keyword');

module.exports.list = function(options) {
    return npm('list', '--json', options).then(results => JSON.parse(results));
};

module.exports.install = function(packages, options) {
    return npm('install', packages, options);
};

module.exports.outdated = function(pkg, options) {
    const args = ['--json', pkg];
    return npm('outdated', args, Object.assign({}, options, {ignoreErrors: true}))
        .then(results => JSON.parse(results));
};

module.exports.searchByKeyword = function(term) {
    return search(term);
};

module.exports.uninstall = function(packages, options) {
    return npm('uninstall', packages, options);
};

module.exports.view = function(pkg, field) {
    const args = [pkg];
    if (field) {
        args.push(field);
    }
    return npm('view', args);
};

function npm(command, args, options) {
    if (typeof options === 'undefined') {
        options = {};
    }

    const opts = {};
    if (options.dir) {
        opts.cwd = options.dir;
    }

    let newArgs;
    if (!Array.isArray(args)) {
        newArgs = [command, args];
    } else {
        newArgs = [command, ...args];
    }

    return new Promise((resolve, reject) => {
        const cp = spawn('npm', newArgs, opts);

        let results = '';
        cp.stdout.on('data', data => results += data.toString());

        cp.on('close', code => {
            if (!options.ignoreErrors && code !== 0) {
                return reject();
            }
            return resolve(results ? results : null);
        });
    });
}
