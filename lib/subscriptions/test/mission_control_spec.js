const assert = require('assert');
const moment = require('moment');
const MissionControl = require('../models/mission_control');
const Mission = require('../models/mission');
const db = require('../db');
const sinon = require('sinon');

sinon.stub(db, 'getMissionByLaunchDate').yields(null, null);
sinon.stub(db, 'createNextMission').yields(null, new Mission());
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