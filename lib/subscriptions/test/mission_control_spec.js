const assert = require('assert');
const MissionControl = require('../models/mission_control');
const sinon = require('sinon');
const Helpers = require("./helpers");

const db = Helpers.stubDb();
const missionControl = new MissionControl({db: db});

describe('Mission planning', function () {
    describe('No current mission', function () {
        let currentMission;
        before(function (done) {
            missionControl.currentMission(function (err, res) {
                currentMission = res;
                done();
            })
        });
        it('is created if none exists', function () {
            assert(currentMission);
            assert(db.getMissionByLaunchDate.called);
        });
    });
    describe('Current mission exists', function () {
        let currentMission;
        before(function (done) {
            db.getMissionByLaunchDate.restore();
            sinon.stub(db, 'getMissionByLaunchDate').yields(null, {id: 1000});
            missionControl.currentMission(function (err, res) {
                currentMission = res;
                done();
            });
        });
        it('it returns mission 1000', function () {
            assert.equal(currentMission.id, 1000);
            assert(db.getMissionByLaunchDate.called);
        });
    });
});