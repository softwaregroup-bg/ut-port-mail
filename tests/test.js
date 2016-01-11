require('repl').start({useGlobal: true});

var wire = require('wire');

wire({
    bunyan: {
        create: {
            module: 'ut-log',
            args: {
                type: 'bunyan',
                name: 'bunyan_test',
                streams: [
                    {
                        level: 'trace',
                        stream: 'process.stdout'
                    }
                ]
            }
        }
    },
    ldap: {
        create: 'ut-port-ldap',
        init: 'init',
        properties: {
            config: {
                id: 'ldap',
                logLevel: 'debug',
                url: 'ldap://172.16.30.1:61008',
                listen: false
            },
            log: {$ref: 'bunyan'}
        }
    }
}, {require: require}).then(function contextLoaded(context) {
    context.ldap.start();
}).done();
