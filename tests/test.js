var assign = require('lodash.assign');
var Mail = require('../index');
var mail = assign(new Mail(), {
    config: {
        id: 'ldap',
        logLevel: 'debug',
        url: 'ldap://172.16.30.1:61008',
        listen: false
    }
});
mail.init();
mail.start();
