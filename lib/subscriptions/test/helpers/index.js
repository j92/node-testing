const MembershipApplication = require('../../models/membership_application');
const Mission = require('../../models/mission');
const DB = require('../../db');
const sinon = require('sinon');

exports.validApplication = new MembershipApplication({
    first: 'Test',
    last: 'User',
    email: 'test@test.com',
    age: 30,
    height: 60,
    weight: 180
});

exports.stubDb = function (args) {
    args || (args = {});
    const mission = args.mission || new Mission();
    const db = new DB();
    sinon.stub(db, 'getMissionByLaunchDate').yields(null, null);
    sinon.stub(db, 'createNextMission').yields(null, mission);
    return db;
};