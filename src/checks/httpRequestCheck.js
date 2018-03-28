const rp = require('request-promise');

async function makeHttpRequest(requestObj,log){

  var options = {
    uri: requestObj.url,
    resolveWithFullResponse: true
  };

  const start = Date.now();
  //const response = await rp(options);
  var responseObject = await rp(options)
    .then(function(response) {
      const end = Date.now() - start;    
      log.info(`    Called ${requestObj.name}.  Response Code : ${response.statusCode}.  Response Time : ${end}ms.`);
      const responseObj=JSON.parse(`{"responseCode": ${response.statusCode}, "responseTime": ${end}}`);
      return responseObj;    
    })
    .catch(function(error) {
      const end = Date.now() - start;
      log.info(`    Called ${requestObj.name}.  Response Code : ${error.statusCode}.  Response Message ${error.response.statusMessage}.  Response Time : ${end}ms.`);
      const responseObj=JSON.parse(`{"responseCode": ${error.statusCode}, "responseMessage": "${error.response.statusMessage}", "responseTime": ${end}}`);
      return responseObj;        
    });

  return responseObject;
}

module.exports = {makeHttpRequest};