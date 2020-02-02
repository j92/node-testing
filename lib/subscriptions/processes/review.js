const async = require('async');
const assert = require('assert');
const MissionControl = require('../models/mission_control.js');

const ReviewProcess = function (args) {
    assert(args.application, 'Need an application to review');
    assert(args.db, 'Need an database to review');
    const app = args.application;
    const missionControl = new MissionControl({db: args.db});

    this.ensureAppValid = function (next) {
        if (!app.isValid()) {
            return next(app.validationMessage(), null);
        }

        next(null, true);
    };

    this.findNextMission = function (next) {
        next(null, {
            commander: null,
            pilot: null,
            MAVPilot: null,
            passengers: []
        });
    };

    this.roleIsAvailable = function (next) {
        next(null, true);
    };

    this.ensureRoleCompatible = function (next) {
        next(null, true);
    };

    this.approveApplication = function (next) {
        next(null, true);
    };

    this.processApplication = function (app, next) {
        async.series({
            validated: this.ensureAppValid,
            mission: this.findNextMission,
            roleAvailable: this.roleIsAvailable,
            roleCompatible: this.ensureRoleCompatible,
            success: this.approveApplication
        }, function (err, result) {
            if (err) {
                return next(null, {
                    success: false,
                    error: err
                });
            }

            result.message = 'welcome to Mars!';
            next(null, result);
        });
    };
};

module.exports = ReviewProcess;