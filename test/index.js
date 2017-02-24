'use strict';

const expect = require('code').expect;
const fs = require('fs');
const path = require('path');

const pm = require('../index');

describe('xenpm-utils', () => {
    it('can list node packages', function() {
        return pm.list({dir: __dirname}).then(results => {
            expect(results.dependencies.mocha).to.not.be.undefined();
        });
    });

    it('can install and uninstall a node package', function() {
        this.timeout(10000);
        const pkg = 'xenon-css-mode';
        const dir = path.join(__dirname, '..', 'node_modules', pkg);

        return pm.install(pkg, {dir: __dirname}).then(() => {
            expect(fs.existsSync(path.join(dir, 'package.json'))).to.be.true();
            return pm.uninstall(pkg, {dir: __dirname});
        }).then(() => {
            return expect(fs.existsSync(path.join(dir, 'package.json'))).to.be.false();
        });
    });

    it('can install and uninstall multiple node packages', function() {
        this.timeout(10000);
        const packages = ['xenon-css-mode', 'left-pad'];
        const dir = path.join(__dirname, '..', 'node_modules');

        return pm.install(packages, {dir: __dirname}).then(() => {
            expect(fs.existsSync(path.join(dir, 'xenon-css-mode', 'package.json'))).to.be.true();
            expect(fs.existsSync(path.join(dir, 'left-pad', 'package.json'))).to.be.true();
            return pm.uninstall(packages, {dir: __dirname});
        }).then(() => {
            expect(fs.existsSync(path.join(dir, 'xenon-css-mode', 'package.json'))).to.be.false();
            return expect(fs.existsSync(path.join(dir, 'left-pad', 'package.json'))).to.be.false();
        });
    });

    it('can search by keyword', function() {
        return pm.searchByKeyword('xenon').then(results => {
            const cssMode = results.filter(result => result.name === 'xenon-css-mode');
            return expect(cssMode.length).to.equal(1);
        });
    });

    it('can get outdated info', function() {
        this.timeout(10000);
        return pm.outdated('npm', {dir: __dirname}).then(results => {
            return expect(results.npm).not.to.be.undefined();
        });
    });

    it('can view package info', function() {
        return pm.view('xenon-css-mode').then(results => {
            return expect(results).not.to.be.empty();
        });
    });

    it('can view a package field', function() {
        return pm.view('xenon-css-mode', 'xenon').then(results => {
            return expect(results).not.to.be.empty();
        });
    });

    it('returns null when there are no results', function() {
        return pm.view('left-pad', 'xenon').then(results => {
            return expect(results).to.be.null();
        });
    });

    it('rejects on an error exit code', function() {
        this.timeout(10000);
        return pm.view('alsdjfowpiasdnfmaenopafjsofiaqj')
            .then(() => fail('should fail'))
            .catch(err => expect(err).to.not.be.null());
    });
});
