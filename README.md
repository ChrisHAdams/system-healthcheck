# System Healthcheck

## A Module to provide a System Healthcheck

### Introduction
This module supports checking whether the following assets are available.

1. Webpages/websites
2. Web Services
3. Servers
4. Databases

To install, run
`npm i system-healthcheck`

There are some tests created.  To run the tests, the command is `npm test`.

This is a standalone module that can be integrated with your own application.  If you prefer a standalone
application, or want an example of usage, then see [System Healthcheck App](https://github.com/ChrisHAdams/system-healthcheck-app).

### Public Methods
At the time of writing, the module exposes two methods in healthcheck.js.
1. getItems : Lists the items that the system-healthcheck is configured to monitor
2. monitor  : Checks each of the configured items.  Results from the checks are stored in a daily log file
in the monitor_reports directory.

### Configuration
When instatiating an object from this class, all it expects is the the log from your own app (for info and error messaging) and a healthcheck options object.

The healthcheck options object should contain:
1. items: An array of items to monitor
2. sendEmail: Boolean defining whether or not to send an email if there are issues
3. mailTransport: An object containing the SMTP details required by NodeMailer
4. mailOptions: An object containing To, From and Email title

#### Items to monitor
Each item to monitor is described in a JSON object, stored in the Items array.

This module checks websites, web services, databases and servers.  Following are examples on how to set up each.

##### Website Checks

The below example shows to how configure a website/webpage check.  If you want to define expected status and and expected response time, add the expectedResults object as shown below. When the monitor runs, it look for the two properties in the expectedResults object.

```
  { "name": "BBC Website",
    "description": "Ping BBC's website",
    "checkType": "website",
    "url": "http://www.bbc.co.uk",
    "expectedResults": {
      "expectedStatusCode": 200,
      "expectedResponseTime": 500
    }
  }
```

##### Web Services
The monitor is capable of calling SOAP and RESTful services including GET and POST requests.

Below is a simple example...
```
  { "name": "Weather API",
    "description": "Ping Weather API",
    "checkType": "service",
    "url": "https://www.metaweather.com/api/location/search/?query=manchester",
    "expectedResults": {
      "expectedStatusCode": 200,
      "expectedResponseTime": 500
    }
  }
```

Next is a more complex example...

```
  { "name": "Some Service Name",
    "description": "Some Description",
    "checkType": "service",
    "method": "POST",
    "headers": {"Content-Type": "application/xml"},
    "url": "the\url\of\the\service",
    "payload": "the Payload required for the service",
    "expectedResults": {
      "expectedStatusCode": 200,
      "expectedResponseTime": 600
    }
  }
```

##### Databases
At this time, the system healthcheck only has support for connecting to Oracle databases.  Oracle checks are disabled by default as the oracle-db package requires libraries to be installed.

To enable database support, run,
` npm -install oracledb `

Once installed via NPM, there will be errors detailing the local components that need to be installed.  These
can be downloaded from the Oracle website.

Below is an example to connect.
```
  { "name": "Database Name",
    "description": "Database Description.",
    "checkType": "database",
    "dbDetails": {"dbType": "oracle",
                  "user": "some_user",
                  "password": "xxxxxxx",
                  "connectionString": "serverName:port/schema"},
    "expectedResults": {
      "expectedStatusCode": "Available",
      "expectedResponseTime": 1000 }
  }
```

##### Servers
The server check using 'ping' to check whether a server can be reached.
```
  {"name": "Google IP Ping",
    "description": "Ping Google's IP Addresss",
    "checkType": "server",
    "url": "172.217.16.68",
    "expectedResults": {
      "expectedStatusCode": "Alive",
      "expectedMaxResponseTime": 100
    }
  }
```

### Logging
As mentioned earlier, the system-healthcheck module expects your applications log object so it can log
application info and error statements.

In addition to this, it creates a daily logged output of all checks, these can be found in the monitor
reports directory.  This is a 'readable' log.

Finally, there is a JSON log in the json folder.  Again, this is a daily rolling log which contains
the results of the checks in JSON.  At some point in the future, this data will be used for trending.

### Email Alerts

Email alerts can also be sent from the monitor.  Emails are only sent when one or more checks fail.
To set up, the options array needs to contain the following:-

sendEmail property.  Boolean.  Defines whether emails should be sent or not.
mailTransport object.  This aligns with mail transport object required by nodemailer.
mailDetails object.  Basic To, From and Title properties for the email.

Below is an example...
```
  "sendEmail:true,
  "mailTransport":{
    "host": "add host details",
    "port": 00,
    "ignoreTLS": true,
    "secure": false
  },
  "mailDetails":{
    "from": "healthcheck-noreply@somedomain.com",
    "to": "john@somedomain.com",
    "subject": "Monitor Alert"
  }
```