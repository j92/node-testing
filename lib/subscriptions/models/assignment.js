const assert = require('assert');
const _ = require('underscore')._;

const Assignment = function (args) {
    assert(args.passenger && args.role && args.mission, 'Need a passenger, role and mission');
    const self = this;

    _.extend(this, args);

    this.passengerIsCompatible = function () {
        if (this.role === 'commander') {
            return this.passenger.age > 35 &&
                this.passenger.age < 70 &&
                this.passenger.weight < 250 &&
                this.passenger.height < 84;
        }

        if (this.role === 'mav-pilot') {
            return this.passenger.age > 35 &&
                this.passenger.age < 55 &&
                this.passenger.weight < 180 &&
                this.passenger.height < 72;
        }

        if (this.role === 'space-tourist') {
            return this.mission.hasRoom &&
                this.mission.totalWeight < 1400 &&
                this.passenger.age > 35 &&
                this.passenger.age < 55 &&
                this.passenger.weight < 200 &&
                this.passenger.height < 72;
        }

        return false;
    }.bind(this)();
};

module.exports = Assignment;