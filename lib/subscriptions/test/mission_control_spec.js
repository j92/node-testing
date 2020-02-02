const assert = require('assert');
const moment = require('moment');
const MissionControl = require('../models/mission_control');
const db = require('../db');
const sinon = require('sinon');

sinon.stub(db, 'find').yields(null, {id: 1});
const mission = new MissionControl({db: db});

describe('Mission control', function () {
    describe('The current mission', function () {
        let currentMission;
        before(function (done) {
            mission.currentMission(function (err, res) {
                currentMission = res;
                done();
            })
        });
        it('is created if none exists', function () {
            assert(currentMission);
        });
    });
});