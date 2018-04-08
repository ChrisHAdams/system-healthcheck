'use strict';

var expect = require('chai').expect;
const Log = require('./dummyLogger');
const HealthCheck = require('../../healthCheck');
var log;

const options={
  "healthcheck": {
    "sendEmail" : false,
    "items" : [
      {
        "name": "BBC Website",
        "description": "Ping BBC's website",
        "checkType": "website",
        "url": "http://www.bbc.co.uk",
        "expectedResults": {
          "expectedStatusCode": 200,
          "expectedResponseTime": 500
        }
      }]
  }};

describe('#callHealthcheck Monitor', function() {

  before(function() {
    // runs before all tests in this block
    log = new Log();
  });


  it('should be able to successfully call a known website', async function() {
    let healthcheck = new HealthCheck(options.healthcheck, log);

    var responseObj = JSON.parse(await healthcheck.monitor());
    console.log(responseObj);
    expect(options.healthcheck.items[0].expectedResults.expectedStatusCode).to.equal(responseObj[0].responseDetails.responseCode);

  });

});