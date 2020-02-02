const moment = require('moment');
const assert = require('assert');
const Mission = require('./mission');

const MissionControl = function (args) {
    assert(args.db, 'Need a db instance');
    this.db = args.db;
};

MissionControl.prototype.currentMission = function (next) {
    const nextMission = moment().add(1, 'month').startOf('month');
    const formattedMissionDate = nextMission.format('MM-DD-YYYY');
    const self = this;

    this.db.find({launchDate: formattedMissionDate}, function(err, foundMission) {
        assert.ok(err === null, err);

        if (foundMission) {
            return next(null, new Mission(foundMission));
        }

        foundMission = new Mission();
        self.db.insert(foundMission, function (err) {
            return next(err, foundMission);
        });
    });
};

MissionControl.prototype.hasSpaceForRole = function (role, next) {
    this.currentMission(function (err, mission) {
        const hasRoom = mission.needsRole(role);
        next(null, hasRoom);
    });
};

module.exports = MissionControl;