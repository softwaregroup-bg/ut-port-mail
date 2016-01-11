module.exports = {
    outgoingMail: {
        title: 'Mail input fields validation',
        type: 'object',
        properties: {
            from: {
                type: 'string',
                minLength: 5
            },
            to: {
                type: 'string',
                minLength: 5
            },
            bcc: {
                type: 'string',
                minLength: 5
            },
            cc: {
                type: 'string',
                minLength: 5
            },
            replyTo: {
                type: 'string',
                minLength: 5
            },
            subject: {
                type: 'string',
                minLength: 3
            },
            text: {
                type: 'string',
                minLength: 10
            },
            html: {
                type: 'string',
                minLength: 10
            },
            headers: {
                type: 'array'
            },
            attachments: {
                type: 'array',
                minItems: 1,
                items: [
                    {
                        type: 'object',
                        properties: {
                            filename: {
                                type: 'string',
                                minLength: 2
                            },
                            content: {
                                type: 'string',
                                minLength: 3
                            },
                            path: {
                                type: 'string',
                                minLength: 2
                            },
                            contentType: {
                                type: 'string',
                                minLength: 3
                            },
                            encoding: {
                                type: 'string',
                                minLength: 2
                            }
                        },
                        additionalProperties: false,
                        anyOf: [
                            {required: ['filename']},
                            {required: ['content']},
                            {required: ['path']},
                            {required: ['contentType']},
                            {required: ['encoding']}
                        ]
                    }
                ]
            },
            charset: {
                type: 'string'
            }
        },
        required: ['from', 'to', 'subject'],
        oneOf: [
            {required: ['text']},
            {required: ['html']}
        ]
    }
};
