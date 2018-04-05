'use strict';

var expect = require('chai').expect;
const Log = require('./dummyLogger');
const PingServerCheck = require('../checks/pingServerCheck');
var log;

const serverObj =  {
        "name": "Google IP Ping",
        "description": "Ping Google's IP Addresss",
        "checkType": "server",
        "url": "172.217.16.68",
        "expectedResults": {
          "expectedStatusCode": "Alive",
          "expectedMaxResponseTime": 100
        }
      };

const badServerObj =  {
        "name": "Google IP Ping",
        "description": "Ping Google's IP Addresss",
        "checkType": "server",
        "url": "172.216.16.69",
        "expectedResults": {
          "expectedStatusCode": "Dead",
          "expectedMaxResponseTime": 100
        }
      };

describe('#pingServerCheck', function() {

  before(function() {
    // runs before all tests in this block
    log = new Log();
  });


  it('should be able to successfully ping a server', async function() {

    var responseObj = await PingServerCheck.makePingRequest(serverObj, log);
    //console.log(responseObj);
    expect(serverObj.expectedResults.expectedStatusCode).to.equal(responseObj.responseCode);

  });

  it('should be able to successfully deduce a server is dead', async function() {
    this.slow(10000);
    var responseObj = await PingServerCheck.makePingRequest(badServerObj, log);
    //console.log(responseObj);
    expect(badServerObj.expectedResults.expectedStatusCode).to.equal(responseObj.responseCode);

  });
});