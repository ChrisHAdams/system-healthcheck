const request = require('./healthcheck/checks/httpRequestCheck');
const webService = require('./healthcheck/checks/webServiceCheck');
const ping = require('./healthcheck/checks/pingServerCheck');
const DateAndTime = require('./healthcheck/dateAndTimeFunctions');
const writeLineToFileFunc = require('./healthcheck/fileOperations').writeLineToFile;
const database = require('./healthcheck/checks/databaseCheck');
const sendAlertEmail = require('./healthcheck/sendEmails');


function Healthcheck(options, log) {

  const CHECKTYPE = {
    website: "website",
    service: "service",
    server: "server",
    database: "database"
  };

  Object.freeze(CHECKTYPE);

  this.options = options;
  this.itemsToCheck = options.items;
  this.sendEmail = options.sendEmail;
  this.log = log;

  if(this.sendEmail){
    // If sendEmail is set, then grab the email properties.
    this.mailTransport = options.mailTransport;
    this.mailDetails = options.mailDetails;
  }

  this.getItems = function() {
    return cleanseItems(this.itemsToCheck);
  }

  function writeLineToFile(textToWrite) {
    var filePath = './monitor_reports';
    var fileName = process.env.NODE_ENV + "-" + DateAndTime.getReverseDate(new Date());

    writeLineToFileFunc(log, filePath, fileName, textToWrite);
  }

  function writeJsonToFile(json) {
    var filePath = './json';
    var fileName = process.env.NODE_ENV + "-" + DateAndTime.getReverseDate(new Date());

    writeLineToFileFunc(log, filePath, fileName, json);
  }

  function cleanseItems(items){

    let clonedArray = deepCopy(items);
    let arrayLength = clonedArray.length;

    for (var i = 0; i < arrayLength; i++) {
      if(clonedArray[i].checkType === CHECKTYPE.database){
        clonedArray[i].dbDetails.password = "xxxxxxx";
      }
    }

    return clonedArray;

  }

  async function runChecks(items) {

    try {
      for (var i = 0; i < items.length; i++) {

        if(items[i].checkType === CHECKTYPE.website){
          items[i].responseDetails = await request.makeHttpRequest(items[i], log);
        }
        if(items[i].checkType === CHECKTYPE.service){
          items[i].responseDetails = await webService.makeWebServiceRequest(items[i], log);
        }
        if(items[i].checkType === CHECKTYPE.server){
          items[i].responseDetails = await ping.makePingRequest(items[i], log);
        }
        if(items[i].checkType === CHECKTYPE.database){
          items[i].responseDetails = await database.makeDatabaseRequest(items[i], log);
        }

      }

    } catch(err){
      log.error("In runChecks (healthcheck.js) catch function");
      log.error(err);
    }
  }

  function checkResults(start, items){

  let failures = false;

  writeLineToFile("");
  writeLineToFile(DateAndTime.getDateAndTime(start));

  for (var j = 0; j < items.length; j++) {

    let item = items[j];
    items[j].date = DateAndTime.getDate(start);
    items[j].time = DateAndTime.getTime(start);
    writeLineToFile(`${item.checkType} - ${item.name}.  Status Code - ${item.responseDetails.responseCode}.  Response Time - ${items[j].responseDetails.responseTime}ms.`);

    if(item.hasOwnProperty('expectedResults')){
      if(item.responseDetails.responseCode !== item.expectedResults.expectedStatusCode) {
        item.responseDetails.responseCodeCheck = "Fail";
        writeLineToFile(`    Status Code Check Failed.  Expected ${item.expectedResults.expectedStatusCode}.  Actual ${item.responseDetails.responseCode}.`);
        failures = true;
      } else {
        item.responseDetails.responseCodeCheck = "Pass";
      }

      if(item.responseDetails.responseTime > item.expectedResults.expectedResponseTime){
        writeLineToFile(`    Response Time Check Failed.  Expected ${item.expectedResults.expectedResponseTime}ms.  Actual ${item.responseDetails.responseTime}ms.`);
        item.responseDetails.responseTimeCheck = "Fail";
        failures = true;
      } else {
        item.responseDetails.responseTimeCheck = "Pass";
      }
    }
    writeJsonToFile(JSON.stringify(items[j]));
  }

  writeLineToFile('='.repeat(80));

  return failures;

  }

  this.monitor = async function() {

    log.info("About to run monitoring checks");
    var clonedItems = [];
    clonedItems = deepCopy(this.itemsToCheck.slice(0));

    var start = new Date();

    await runChecks(clonedItems);

    let failures = checkResults(start, clonedItems);

    if((failures) && (this.sendEmail)){
      sendAlertEmail.sendEmail(this.mailTransport,
                               this.mailDetails,
                               clonedItems,
                               log);
    }

    log.info("Completed monitoring checks.");

    return JSON.stringify(cleanseItems(clonedItems));

  }

}

function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}

module.exports = Healthcheck;
