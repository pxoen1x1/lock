'use strict';

const mailerOptions = {
    from: sails.config.application.mailer.from,
    provider: {
        path: sails.config.application.mailer.providerPath
    }
};
const host = sails.config.host;
const port = sails.config.port;

let mailer = require('sails-service-mailer');

let MailerService = {
    successRegistration(user) {
        let templatePath = sails.config.application.mailer.templates.successRegistration;
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
                })
            .catch(
                (err) => sails.log.error(err)
            );
    },
    confirmRegistration(user) {
        let templatePath = sails.config.application.mailer.templates.confirmRegistration;
        let options = {};
        options.user = user;
        options.url = `http://${host}:${port}${sails.config.application.urls.emailConfirmation}?token=${user.token}`;

        ViewService.getEmailTemplate(templatePath, options)
            .then(
                (template) => {
                    mailerOptions.subject = template.subject;

                    return mailer('sendmail', mailerOptions)
                        .send({
                            to: user.email,
                            html: template.html
                        });
                })
            .catch(
                (err) => sails.log.error(err)
            );
    }
};

module.exports = MailerService;

