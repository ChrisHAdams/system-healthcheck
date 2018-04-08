'use strict';

var expect = require('chai').expect;
const Log = require('./dummyLogger');
const WebServiceCheck = require('../checks/webServiceCheck');
var log;

const goodServiceObj =  {
        "name": "Weather API",
        "description": "Ping Weather API",
        "checkType": "service",
        "url": "https://www.metaweather.com/api/location/search/?query=manchester",
        "expectedResults": {
          "expectedStatusCode": 200,
          "expectedResponseTime": 500
        }
      };

const badServiceObj =  {
  "name": "Weather API",
        "description": "Ping Weather API",
        "checkType": "service",
        "url": "https://www.metaweather.com/api/location/search/?query=manchester",
        "expectedResults": {
          "expectedStatusCode": 200,
          "expectedResponseTime": 500
        }
      };

describe('#webServiceCheck', function() {

  before(function() {
    // runs before all tests in this block
    log = new Log();
  });


  it('should be able to successfully call a web service', async function() {
    var responseObj = await WebServiceCheck.makeWebServiceRequest(goodServiceObj, log);

    expect(goodServiceObj.expectedResults.expectedStatusCode).to.equal(responseObj.responseCode);

  });

  it('should be able to successfully deduce a server is dead', async function() {
    var responseObj = await WebServiceCheck.makeWebServiceRequest(badServiceObj, log);

    expect(badServiceObj.expectedResults.expectedStatusCode).to.equal(responseObj.responseCode);

  });
});