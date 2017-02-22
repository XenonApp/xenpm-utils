'use strict';

const spawn = require('child_process').spawn;
const JSON5 = require('json5');
const path = require('path');
const search = require('npm-keyword');

const npmPath = `${path.join(__dirname, 'node_modules', '.bin', 'npm')}`;

module.exports.install = function(packages, options) {
    return npm('install', packages, options);
};

module.exports.outdated = function(packages, options) {
    let args;
    if (!Array.isArray(packages)) {
        args = ['--json', packages];
    } else {
        args = ['--json', ...packages];
    }
    return npm('outdated', args, Object.assign({}, options, {ignoreErrors: true}))
        .then(results => JSON.parse(results));
};

module.exports.searchByKeyword = function(term) {
    return search(term);
};

module.exports.uninstall = function(packages, options) {
    return npm('uninstall', packages, options);
};

module.exports.view = function(pkg) {
    return npm('view', pkg).then(results => JSON5.parse(results));
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
        const cp = spawn(npmPath, newArgs, opts);

        cp.on('error', err => console.error(err));

        let results = '';
        cp.stdout.on('data', data => results += data.toString());

        cp.on('close', code => {
            if (!options.ignoreErrors && code !== 0) {
                return reject();
            }
            return resolve(results);
        });
    });
}