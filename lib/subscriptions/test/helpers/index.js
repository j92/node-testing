const MembershipApplication = require('../../models/membership_application');

exports.validApplication = new MembershipApplication({
    first: 'Test',
    last: 'User',
    email: 'test@test.com',
    age: 30,
    height: 60,
    weight: 180
});