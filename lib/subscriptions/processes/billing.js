const assert = require('assert');

const Billing = function(args){
  assert(args.stripeKey, 'Need a stripe key');
  const stripe = require('stripe')(args.stripeKey);

  this.createSubscription = function(args, next){
    assert(args.email && args.name && args.plan && args.card);
    stripe.customers.create({
      email : args.email,
      description: args.name,
      card : args.card,
      plan: args.plan
    }, next);
  };

  this.cancelSubscription = function(args, next){

  };

  this.changeSubscription = function(args, next){

  };

};

module.exports = Billing;