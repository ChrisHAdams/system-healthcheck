const oracle = require('oracledb');

async function makeOracleDbRequest(requestObj,log){

  const start = Date.now();

  var responseObj = await oracle.getConnection(
    {
      user          : requestObj.dbDetails.user,
      password      : requestObj.dbDetails.password,
      connectString : requestObj.dbDetails.connectionString
    } )
    .then(function(conn) {
      return conn.execute(
        `SELECT :id
         FROM dual`,
        [1]  // bind value for :id
      )
        .then(function(result) {
          const end = Date.now() - start;
          conn.close();
          log.info(`    Called ${requestObj.name}.  Response Code : Available.  Response Time : ${end}ms.`);
          const responseObj=JSON.parse(`{"responseCode": "Available", "responseTime": ${end}}`);
          
          return responseObj; 
        })
        .catch(function(err) {
          const end = Date.now() - start;
          conn.close();
          log.info(`    Called ${requestObj.name}.  Response Code : ${err.message}.  Response Time : ${end}ms.`);
          const responseObj=JSON.parse(`{"responseCode": ${err.message}, "responseTime": ${end}}`);
          return responseObj; 
        });
    })
    .catch(function(err) {
      const end = Date.now() - start;
      log.info(`    Called ${requestObj.name}.  Response Code : ${err.message}.  Response Time : ${end}ms.`);
      const responseObj=JSON.parse(`{"responseCode": ${err.message}, "responseTime": ${end}}`);
      return responseObj; 
    });
  
  return responseObj;
  
}

module.exports = {makeOracleDbRequest};