function DummyLogger() {

  this.log = [];

  this.info = function(message) {

    this.log.push({"type": "info", "message":message});

  }

  this.error = function(message) {
    this.log.push({"type": "error", "message":message});
  }

  this.getLogEntries = function() {
    return this.log;
  }
}

module.exports = DummyLogger;