const assert = require('assert');
const Mission = require('../models/mission');
const Assignment = require('../models/assignment');
const Helpers = require("./helpers");
const goodSpecs = {age: 40, height: 60, weight: 190};
const _ = require('underscore')._;

describe('Assignments', function () {
    describe('Commander with valid app', function () {
        let assignment;
        before(function (done) {
            assignment = new Assignment({
                passenger: goodSpecs,
                mission: new Mission({id: 1000}),
                role: 'commander'
            });
            done();
        });
        it('is compatible', function () {
            assert(assignment.passengerIsCompatible);
        });
    });

    describe('Commander with overweight', function () {
        let assignment;
        before(function (done) {
            assignment = new Assignment({
                passenger: {weight: 250},
                mission: new Mission({id: 1000}),
                role: 'commander'
            });
            done();
        });
        it('is not compatible', function () {
            assert(!assignment.passengerIsCompatible);
        });
    });

    describe('Commander to tall', function () {
        let assignment;
        before(function (done) {
            assignment = new Assignment({
                passenger: {height: 300},
                mission: new Mission({id: 1000}),
                role: 'commander'
            });
            done();
        });
        it('is not compatible', function () {
            assert(!assignment.passengerIsCompatible);
        });
    });

    describe('Passenger availability - empty mission', function () {
        let assignment;
        before(function (done) {
            assignment = new Assignment({
                passenger: goodSpecs,
                mission: new Mission({id: 1000}),
                role: 'space-tourist'
            });
            done();
        });
        it('available with no passengers', function () {
            assert(assignment.passengerIsCompatible);
        });
    });

    describe('Passenger availability - full mission', function () {
        let assignment;
        before(function (done) {
            assignment = new Assignment({
                passenger: goodSpecs,
                mission: new Mission({
                    id: 1000,
                    colonists: new Array(4),
                    tourists: new Array(4)
                }),
                role: 'space-tourist'
            });
            done();
        });
        it('not available with too much passengers', function () {
            assert(!assignment.passengerIsCompatible);
        });
    });
});