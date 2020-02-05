const stripe = require('stripe')('test_key');

stripe.customers.create({
    email: 'test@test.com',
    description: 'Test customer',
    plan: 'commander',
    card: {
        name: 'Test user',
        number: '41111111111',
        exp_month: 11,
        exp_year: 2019
    }
}, function (err, customer) {

});