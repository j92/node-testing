const assert = require('assert');
const MembershipApplication = require('../models/membership_application');
const ReviewProcess = require('../processes/review');
const sinon = require('sinon');

describe('The review process', function () {
    describe('Receive a valid application', function () {
        let decision;
        const validApp = new MembershipApplication({
            first: 'Test',
            last: 'User',
            email: 'test@test.com',
            age: 30,
            height: 60,
            weight: 180
        });

        const review = new ReviewProcess({application: validApp});
        sinon.spy(review, 'ensureAppValid');
        sinon.spy(review, 'findNextMission');
        sinon.spy(review, 'roleIsAvailable');
        sinon.spy(review, 'ensureRoleCompatible');
        before(function (done) {
            review.processApplication(validApp, function (err, result) {
                decision = result;
                done();
            });
        });

        it('returns a success', function () {
            assert(decision.success, decision.message);
        });
        it('ensure the app is validated', function () {
            assert(review.ensureAppValid.called);
        });
        it('ensure the mission is selected', function () {
            assert(review.findNextMission.called);
        });
        it('ensure the role is available', function () {
            assert(review.roleIsAvailable.called);
        });
        it('ensure the role is compatible', function () {
            assert(review.ensureRoleCompatible.called);
        });
    });
});