const oracleDb = require('./oracleDbCheck');

async function makeDatabaseRequest(requestObj,log){
  
  if(requestObj.dbDetails.dbType == 'oracle'){  
    return await oracleDb.makeOracleDbRequest(requestObj,log);
  }
  
}

module.exports = {makeDatabaseRequest};