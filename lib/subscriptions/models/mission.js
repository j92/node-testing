const moment = require('moment');
const assert = require('assert');

const Mission = function (args) {
    args = args || {};

    const mission = {
        status: 'open',
        commander: args.commander || null,
        MAVPilot: args.MAVPilot || null,
        colonists: args.colonists || [],
        tourists: args.tourists || [],
        launchDate: args.launchDate || (moment().add(1, 'month').startOf('month').format('MM-DD-YYYY')),
    };

    mission.isFlying = function () {
        return this.status === 'open';
    };

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