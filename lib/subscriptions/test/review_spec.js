const assert = require('assert');
const Helpers = require('./helpers');
const ReviewProcess = require('../processes/review');
const Billing = require('../processes/billing');
const sinon = require('sinon');
const _ = require('underscore')._;

describe('The review process', function () {
    const db = Helpers.stubDb();
    const billing = new Billing({stripeKey: 'xxx'});

    before(function () {
        sinon.stub(db, 'saveAssignment').yields(null, {saved: true});

        const billingStub = sinon.stub(billing, 'createSubscription');
        billingStub.withArgs(Helpers.goodStripeArgs)
            .yields(null, Helpers.goodStripeResponse);

        billingStub.withArgs(Helpers.badStripeArgs)
            .yields('Credit card declined');
    });

    describe('Receive a valid application', function () {
        let decision, review, validApp = _.clone(Helpers.validApplication);

        before(function (done) {
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
        badBillingApp.card = 2;

        before(function (done) {
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