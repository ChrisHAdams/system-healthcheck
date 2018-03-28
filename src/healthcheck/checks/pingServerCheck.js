const ping = require('ping');

async function makePingRequest(requestObj,log){

  const start    = Date.now();
  const response = await ping.promise.probe(requestObj.url);
  const end      = Date.now() - start;

  let status = response.alive ? "Alive" : "Dead";
  let responseObj = {}
  
  if(status == "Alive"){
    log.info(`    Called ${requestObj.name}.  Response Code : ${status}.  Response Time : ${response.max}.`);
    responseObj=JSON.parse(`{"responseCode": "${status}", "responseTime": ${response.max}}`);
  } else {
    log.info(`    Called ${requestObj.name}.  Response Code : ${status}.  Response Time : ${end}.`);
    responseObj=JSON.parse(`{"responseCode": "${status}", "responseTime": ${end}}`);
  }
  
  return responseObj;

}

module.exports = {makePingRequest};