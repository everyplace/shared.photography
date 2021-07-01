const fs = require('fs');
const fetch = require('node-fetch');
const stripe_token = (process.env.stripe_mode === 'live') ? process.env.stripe_token_live : process.env.stripe_token_test;
const stripe = require('stripe')(stripe_token);

exports.debug = async (req, res, next) => {
  let data = 'hi';
  
  let plans = await stripe.plans.list();
  
  res.json(plans);
};

/*
A customer needs to exist
https://stripe.com/docs/api/customers

A plan needs to exist
https://stripe.com/docs/api/plans

A subscription is a customer subscribing to a plan
https://stripe.com/docs/api/subscriptions

A usage record is an event that logs usage on a subscription, which implies a user incurring a charge on a plan

//increment usage for a plan
https://stripe.com/docs/api/usage_records/create

{
  object: "list",
  data: [
    {
      id: "plan_ESP9JMnQP5IlaB",
      object: "plan",
      active: true,
      aggregate_usage: "sum",
      amount: 69,
      billing_scheme: "per_unit",
      created: 1549136404,
      currency: "usd",
      interval: "month",
      interval_count: 1,
      livemode: true,
      metadata: { },
      nickname: "Monthly",
      product: "prod_ES9R6cVsoV53cS",
      tiers: null,
      tiers_mode: null,
      transform_usage: null,
      trial_period_days: null,
      usage_type: "metered"
    }
  ],
  has_more: false,
  url: "/v1/plans"
}
*/