'use strict';

const fs = require('fs');
const path = require('path');

const pm = require('../index');

describe('xenpm-utils', () => {
    it('can install and uninstall a node package', (done) => {
        const pkg = 'xenon-css-mode';
        const dir = path.join(__dirname, '..', 'node_modules', pkg);

        pm.install(pkg, {dir: __dirname}).then(() => {
            expect(fs.existsSync(path.join(dir, 'package.json'))).toBe(true);
            return pm.uninstall(pkg, {dir: __dirname});
        }).then(() => {
            expect(fs.existsSync(path.join(dir, 'package.json'))).toBe(false);
            done();
        }).catch(err => {
            fail(err);
            done();
        });
    });

    it('can install and uninstall multiple node packages', (done) => {
        const packages = ['xenon-css-mode', 'json5'];
        const dir = path.join(__dirname, '..', 'node_modules');

        pm.install(packages, {dir: __dirname}).then(() => {
            expect(fs.existsSync(path.join(dir, 'xenon-css-mode', 'package.json'))).toBe(true);
            expect(fs.existsSync(path.join(dir, 'json5', 'package.json'))).toBe(true);
            return pm.uninstall(packages, {dir: __dirname});
        }).then(() => {
            expect(fs.existsSync(path.join(dir, 'xenon-css-mode', 'package.json'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'json5', 'package.json'))).toBe(false);
            done();
        }).catch(err => {
            fail(err);
            done();
        });
    });

    it('can search by keyword', (done) => {
        pm.searchByKeyword('xenon').then(results => {
            const cssMode = results.filter(result => result.name === 'xenon-css-mode');
            expect(cssMode.length).toBe(1);
            done();
        }).catch(err => {
            fail(err);
            done();
        });
    });

    it('can get outdated info', (done) => {
        pm.outdated('npm', {dir: __dirname}).then(results => {
            expect(results.npm).not.toBeUndefined();
            done();
        }).catch(err => {
            fail(err);
            done();
        });
    });

    it('can view package info', (done) => {
        pm.view('json5').then(results => {
            expect(results.name).not.toBeUndefined();
            done();
        }).catch(err => {
            fail(err);
            done();
        });
    });
});
