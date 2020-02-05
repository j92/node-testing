const assert = require('assert');
const Helpers = require('./helpers');
const ReviewProcess = require('../processes/review');
const sinon = require('sinon');

describe('The review process', function () {
    describe('Receive a valid application', function () {
        let decision, review, validApp = Helpers.validApplication;

        before(function (done) {
            const db = Helpers.stubDb();
            sinon.stub(db, 'saveAssignment').yields(null, {saved: true});
            review = new ReviewProcess({application: validApp, db: db});
            sinon.spy(review, 'ensureAppValid');
            sinon.spy(review, 'findNextMission');
            sinon.spy(review, 'roleIsAvailable');
            sinon.spy(review, 'ensureRoleCompatible');
            review.processApplication(validApp, function (err, result) {
                decision = result;
                done();
            });
        });

        it('returns a success', function () {
            assert(decision.success, decision.message);
        });
        it('returns an assignment', function () {
            assert(decision.assignment);
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