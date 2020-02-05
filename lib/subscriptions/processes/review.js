const async = require('async');
const assert = require('assert');
const MissionControl = require('../models/mission_control.js');
const Assignment = require('../models/assignment.js');

const ReviewProcess = function (args) {
    assert(args.application, 'Need an application to review');
    assert(args.billing, 'Need an billing processor');
    assert(args.db, 'Need an database to review');
    let db = args.db;
    let billing = args.billing;
    let assignment, mission, app = args.application;
    const missionControl = new MissionControl({db: args.db});

    this.ensureAppValid = function (next) {
        if (!app.isValid()) {
            return next(app.validationMessage(), null);
        }

        next(null, true);
    };

    this.findNextMission = function (next) {
        missionControl.currentMission(function (err, res) {
            if (err) {
                return next(err, null);
            }
            mission = res;
            next(null, res);
        });
    };

    this.roleIsAvailable = function (next) {
        missionControl.hasSpaceForRole(app.role, next);
    };

    this.ensureRoleCompatible = function (next) {
        assignment = new Assignment({
            passenger: app,
            role: app.role,
            mission: mission,
        });

        next(null, assignment.passengerIsCompatible);
    };

    this.approveApplication = function (next) {
        db.saveAssignment({assignment}, next);
    };

    this.startSubscription = function (next) {
        billing.createSubscription({
            name: app.first + ' ' + app.last,
            email: app.email,
            plan: app.role,
            card: app.card
        }, next);
    };

    this.processApplication = function (app, next) {
        async.series({
            validated: this.ensureAppValid,
            mission: this.findNextMission,
            roleAvailable: this.roleIsAvailable,
            roleCompatible: this.ensureRoleCompatible,
            subscription: this.startSubscription,
            assignment: this.approveApplication
        }, function (err, result) {
            if (err) {
                return next(null, {
                    success: false,
                    error: err
                });
            }

            result.success = true;
            result.message = 'welcome to Mars!';
            next(null, result);
        });
    };
};

module.exports = ReviewProcess;