# System Healthcheck

## A Module to provide a System Healthcheck

This module supports checking whether the following are available.

1. Webpages/websites
2. Web Services
3. Servers
4. Databases

To install, run
``npm i system-healthcheck

This is a standalone module that can be integrated with your own application.  If you prefer a standalone
application, or want an example of usage, then see [System Healthcheck App](https://github.com/ChrisHAdams/system-healthcheck-app).

When instatiating an object from this class, all it expects is the the log from your own app for info and error messaging.

The rest of the configuration is pulled in from the a healthcheck options object from app config.
The healthcheck options object should contain:
1. items: An array of items to monitor
2. sendEmail: Boolean defining whether or not to send an email if there are issues
3. mailTransport: An object containing the SMTP details required by NodeMailer
4. mailOptions: An object containing To, From and Email title