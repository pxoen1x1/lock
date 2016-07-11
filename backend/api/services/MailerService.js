'use strict';

let appConfig = require('./appConfig');

const mailerOptions = {
    from: appConfig.mailer.from,
    provider: {
        path: appConfig.mailer.providerPath
    }
};

let mailer = require('sails-service-mailer');

let MailerService = {
    successRegistration(user) {
        let templatePath = appConfig.mailer.templates.successRegistration;
        let options = {};
        options.user = user;

        ViewService.getEmailTemplate(templatePath, options)
            .then(
                (template) => {
                    mailerOptions.subject = template.subject;

                    return mailer('sendmail', mailerOptions)
                        .send({
                            to: user.email,
                            html: template.html
                        });
                });
    },
    confirmRegistration(user) {
        mailerOptions.subject = appConfig.mailer.subjects.confirmRegistration;

        return mailer('sendmail', mailerOptions)
            .send({
                to: user.email,
                text: `${user.fullName} confirm registration`
            });
    }
};

module.exports = MailerService;

