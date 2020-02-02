const _ = require('underscore')._;
const moment = require('moment');

const MembershipApplication = function (args) {
    _.extend(this, args);

    this.validUntil = args.validUntil ? moment(args.validUntil) : moment().add(10, 'days');

    this.expired = function () {
        return this.validUntil.isBefore(moment());
    };

    this.validationMessage = function () {
        if (this.isValid()) {
            return 'App is valid';
        }

        if (!this.emailIsValid()) return 'Email is invalid';
        if (!this.nameIsValid()) return 'Name is invalid';
        if (!this.heightIsValid()) return 'Height is invalid';
        if (!this.ageIsValid()) return 'Age is invalid';
        if (!this.weightIsValid()) return 'Weight is invalid';
        if (this.expired()) return 'Application is expired';
    };

    this.nameIsValid = function () {
        return this.first && this.first.length > 1 &&
            this.last && this.last.length > 1;
    };

    this.emailIsValid = function () {
        return this.email && this.email.length > 3 && this.email.indexOf('@') > -1;
    };

    this.heightIsValid = function () {
        return this.height && this.height >= 60 && this.height < 75;
    };

    this.ageIsValid = function () {
        return this.age && this.age < 100 && this.age > 15;
    };

    this.weightIsValid = function () {
        return this.weight && this.weight > 100 && this.weight < 300;
    };

    this.isValid = function () {
        return !this.expired() &&
            this.nameIsValid() &&
            this.emailIsValid() &&
            this.heightIsValid() &&
            this.ageIsValid() &&
            this.weightIsValid();
    }
};

module.exports = MembershipApplication;