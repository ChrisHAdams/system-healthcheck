let config = require('config');
const mailer = require('nodemailer');

function sendEmail(items, log){

  let smtp = mailer.createTransport(config.get('mailTransport'));
  let mailDetails = config.get('mailDetails');
  let mailOptions = {"to": mailDetails.to,
                     "from" : mailDetails.from,
                     "subject": mailDetails.subject,
                     "html": getHtml(items)};

  trySend(3, err => !err ? log.info('Alert email sent') : log.error('Alert email could not be sent', err));

  function trySend(tries, callback, log) {
    smtp.sendMail(mailOptions, err => {
      if(!err) {
        callback();
      } else if(tries) {
        log.warn('Email send failed - will try again...');
        setTimeout(() => trySend(tries - 1, callback), 3000);
      } else {
        callback(err);
      }
    });
  }
}

function getAlertText(items) {

  let returnArray = [];

  for (var i = 0; i < items.length; i++) {

    let reportItem = false;
    let item = items[i];
    if (item.responseDetails.hasOwnProperty('responseCodeCheck')) {
      if(item.responseDetails.responseCodeCheck == 'Fail') {
        reportItem = true;
      }
    }

    if (item.responseDetails.hasOwnProperty('responseTimeCheck')) {
      if(item.responseDetails.responseTimeCheck == 'Fail') {
        reportItem = true;
      }
    }

    if (reportItem){
      let lineObj =  {"header": `${item.name} check FAILED`,
                      "description": `    ${item.description}`,
                      "statusCheck": `        Status Code - received ${item.responseDetails.responseCode}.  Expected ${item.expectedResults.expectedStatusCode}.`,
                      "timeCheck": `          Response Time - ${item.responseDetails.responseTime}ms.  Expected < ${item.expectedResults.expectedResponseTime}ms`};

      returnArray.push(lineObj);
    }
  }

  return returnArray;

}

function getHtml(items) {

  let dataArray = getAlertText(items);

  let htmlString = `
  <html>
    <head>
      <style>
        body: {
          font-family: Calibri,sans-serif;
        }
      </style>
    </head>
    <body>
      <h3>The following checks failed....</h3>

      ${dataArray.map (item=> `<p>${item.header}<br/>${item.description}<br/>${item.statusCheck}<br/>${item.timeCheck}</p>`)}
    </body>
  </html>`;

  return htmlString;
}

module.exports = {sendEmail};