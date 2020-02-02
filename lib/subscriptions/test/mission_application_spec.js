const assert = require('assert');
const MembershipApplication = require('../models/membership_application');

describe('Membership application requirements', function () {
    let validApp;

    before(function () {
        validApp = new MembershipApplication({
            first: 'Test',
            last: 'User',
            email: 'test@test.com',
            age: 30,
            height: 60,
            weight: 180
        });
    });

    describe('Validations successful if', function () {
        it('application is valid when all validators return true', function () {
            assert(validApp.isValid(), 'App not valid');
        });
    });

    describe('Application invalid if...', function () {
        it('is expired', function () {
            const app = new MembershipApplication({validUntil: Date.parse('01/01/2010')});
            assert(app.expired());
        });
        it('email is 4 chars or less', function () {
            const app = new MembershipApplication({email: 'd@d'});
            assert(!app.emailIsValid());
        });
        it('email does not have @', function () {
            const app = new MembershipApplication({email: 'dodnl'});
            assert(!app.emailIsValid());
        });
        it('email is omitted', function () {
            const app = new MembershipApplication({});
            assert(!app.emailIsValid());
        });
        it('height is less than 60', function () {
            const app = new MembershipApplication({height: 10});
            assert(!app.heightIsValid());
        });
        it('height is more than 75', function () {
            const app = new MembershipApplication({height: 76});
            assert(!app.heightIsValid());
        });
        it('height is omitted', function () {
            const app = new MembershipApplication({});
            assert(!app.heightIsValid());
        });
        it('age is more than 100', function () {
            const app = new MembershipApplication({age: 100});
            assert(!app.ageIsValid());
        });
        it('age is less than 15', function () {
            const app = new MembershipApplication({age: 14});
            assert(!app.ageIsValid());
        });
        it('age is omitted', function () {
            const app = new MembershipApplication({});
            assert(!app.ageIsValid());
        });
        it('weight is less than 100', function () {
            const app = new MembershipApplication({weight: 99});
            assert(!app.weightIsValid());
        });
        it('weight is more than 300', function () {
            const app = new MembershipApplication({weight: 300});
            assert(!app.weightIsValid());
        });
        it('weight is omitted', function () {
            const app = new MembershipApplication({});
            assert(!app.weightIsValid());
        });
        it('first is omitted', function () {
            const app = new MembershipApplication({});
            assert(!app.nameIsValid());
        });
        it('last is omitted', function () {
            const app = new MembershipApplication({});
            assert(!app.nameIsValid());
        });
    });
});