const assert = require('assert');
const Helpers = require('./helpers');
const ReviewProcess = require('../processes/review');
const Billing = require('../processes/billing');
const sinon = require('sinon');
const nock = require('nock');
const _ = require('underscore')._;

describe('The review process', function () {
    const db = Helpers.stubDb();
    const billing = new Billing({stripeKey: 'xxx'});

    before(function () {
        sinon.stub(db, 'saveAssignment').yields(null, {saved: true});
    });

    describe('Receive a valid application', function () {
        let decision, review, validApp = _.clone(Helpers.validApplication);

        before(function (done) {
            nock('https://api.stripe.com/v1')
                .post('/customers')
                .reply(200, Helpers.goodStripeResponse);

            review = new ReviewProcess({
                application: validApp,
                db: db,
                billing: billing
            });

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
        it('returns an subscription', function () {
            assert(decision.subscription);
        });
    });

    describe('Valid application, failed billing', function () {
        let decision, review, badBillingApp = _.clone(Helpers.validApplication);

        before(function (done) {
            nock('https://api.stripe.com/v1')
                .post('/customers')
                .reply(403, Helpers.badStripeResponse);

            review = new ReviewProcess({
                application: badBillingApp,
                db: db,
                billing: billing
            });
            review.processApplication(badBillingApp, function (err, result) {
                decision = result;
                done();
            });
        });

        it('returns false for success', function () {
            assert(!decision.success);
        });
    })
});