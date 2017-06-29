const Port = require('ut-bus/port');
const util = require('util');
const MailClient = require('./client');
const { MailClientHelpers } = require('./helpers');

var mailClientHelpers;

function MailPort() {
    Port.call(this);
    this.config = {
        id: 'mail',
        type: 'mail',
        logLevel: 'trace',
        service: false,
        settings: {},
        ssl: false
    };
}

util.inherits(MailPort, Port);

MailPort.prototype.init = function init() {
    Port.prototype.init.apply(this, arguments);
    mailClientHelpers = new MailClientHelpers();
};

MailPort.prototype.start = function start(callback) {
    // bindings
    Port.prototype.start.apply(this, arguments);
    this.pipeExec(this.exec.bind(this), this.config.concurrency);
};

MailPort.prototype.exec = function(msg) {
    var mailClient = new MailClient(mailClientHelpers.parseMailClientCreateParams(msg));
    var mailOptions = mailClientHelpers.parseMailOptionsParams(msg);
    return mailClient.send(mailOptions)
        .then(emailSendResponse => emailSendResponse)
        .catch(error => {
            throw error;
        });
};

module.exports = MailPort;
