'use strict';

var expect = require('chai').expect;
const Log = require('./dummyLogger');
const HttpRequestCheck = require('../checks/httpRequestCheck');
var log;

const goodWebsiteObj = {
        "name": "Google Website",
        "description": "Ping Google's website",
        "checkType": "website",
        "url": "http://www.google.com",
        "expectedResults": {
          "expectedStatusCode": 200,
          "expectedResponseTime": 600
        }
      };

const badWebsiteObj = {
        "name": "Bad Website",
        "description": "Ping a Bad website",
        "checkType": "website",
        "url": "http://localhost:8006/api/runMonitor",
        "expectedResults": {
          "expectedStatusCode": 404,
          "expectedResponseTime": 600
        }
      };

describe('#callWebsiteCheck', function() {

  before(function() {
    // runs before all tests in this block
    log = new Log();
  });


  it('should be able to successfully call a known website', async function() {

    var responseObj = await HttpRequestCheck.makeHttpRequest(goodWebsiteObj, log);
    expect(goodWebsiteObj.expectedResults.expectedStatusCode).to.equal(responseObj.responseCode);

  });

  it('should be able to successfully deduce a website is down', async function() {

    var responseObj = await HttpRequestCheck.makeHttpRequest(badWebsiteObj, log);
    console.log(responseObj);
    expect(badWebsiteObj.expectedResults.expectedStatusCode).to.equal(responseObj.responseCode);

  });
});