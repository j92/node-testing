const moment = require('moment');
const assert = require('assert');
const _ = require('underscore')._;

const Mission = function (args) {
    args = args || {};

    const mission = {
        id: args.id || null,
        status: 'open',
        commander: args.commander || null,
        MAVPilot: args.MAVPilot || null,
        colonists: args.colonists || [],
        tourists: args.tourists || [],
        assignments: [],
        launchDate: args.launchDate || (moment().add(1, 'month').startOf('month').format('MM-DD-YYYY')),
    };

    mission.isFlying = function () {
        return this.status === 'open';
    };

    mission.passengers = function () {
        return mission.tourists.length + mission.colonists.length;
    }();

    mission.passengersAndCrew = function () {
        return mission.passengers + 2;
    }();

    mission.hasRoom = function () {
        return mission.passengersAndCrew < 10;
    }();

    mission.totalWeight = function () {
        let weight = 0;
        _.each(this.assignments, function (assignment) {
            weight = assignment.passenger.weight
        });
        return weight;
    }();

    mission.needsRole = function (role) {
        if (!this.isFlying()) {
            return false;
        }

        if (role === 'mission-commander') {
            return !this.commander;
        }

        if (role === 'mav-pilot') {
            return !this.MAVPilot;
        }

        if (role === 'colonist') {
            return this.colonists.length <= 10;
        }

        if (role === 'space-tourist') {
            return this.tourists.length <= 20;
        }

        return false;
    };

    mission.assignRole = function (args) {
        assert.ok(args.user && args.role, 'Need a user and a role in order to assign');
        const user = args.user;
        const role = args.role;
        this.totalWeight += user.weight;

        if (role === 'mission-commander') {
            return this.commander = user;
        }

        if (role === 'mav-pilot') {
            return this.MAVPilot = user;
        }

        if (role === 'colonist') {
            return this.colonists.push(user);
        }

        if (role === 'space-tourist') {
            return this.tourists.push(user);
        }

        return this;
    };

    return mission;
};

module.exports = Mission;