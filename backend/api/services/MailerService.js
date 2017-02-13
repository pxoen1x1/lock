/*global sails, ViewService*/

'use strict';

const mailerOptions = {
    from: sails.config.application.mailer.from,
    provider: {
        path: sails.config.application.mailer.providerPath
    }
};

const HOST = sails.config.baseUrl;

let mailer = require('sails-service-mailer');

let MailerService = {
    successRegistration(user) {
        let templatePath = sails.config.application.mailer.templates.successRegistration;
        let options = {};
        options.user = user;
        options.email = user.auth.email;

        return this.sendMail(templatePath, options)
            .then(
                () => user
            );
    },
    confirmRegistration(user) {
        let templatePath;

        if (user.details || user.isGroupAdmin) {
            templatePath = sails.config.application.mailer.templates.confirmRegistration.provider;
        } else {
            templatePath = sails.config.application.mailer.templates.confirmRegistration.customer;
        }

        let options = {};
        options.user = user;
        options.email = user.auth.email;
        options.url = `${HOST}${sails.config.application.urls.emailConfirmation}` +
            `?token=${user.emailConfirmationToken}`;

        return this.sendMail(templatePath, options)
            .then(
                () => user
            );
    },
    generatedPassword(password, email) {
        let templatePath = sails.config.application.mailer.templates.generatedPassword;
        let options = {};
        options.password = password;
        options.email = email;

        return this.sendMail(templatePath, options);
    },
    passwordResetRequest(user) {
        let templatePath = sails.config.application.mailer.templates.passwordResetRequest;
        let options = {};
        options.user = user;
        options.email = user.auth.email;
        options.url = `${HOST}${sails.config.application.urls.passwordResetRequest}/` +
            `${user.resetToken.token}`;

        return this.sendMail(templatePath, options)
            .then(
                () => user
            );
    },
    passwordResetConfirmation(user) {
        let templatePath = sails.config.application.mailer.templates.passwordResetConfirmation;
        let options = {};
        options.user = user;

        return this.sendMail(templatePath, options)
            .then(
                () => user
            );
    },
    sendGroupInvitation(user, group, invitation) {
        let templatePath = sails.config.application.mailer.templates.groupInvitation;

        let options = {};
        options.user = user;
        options.email = user.auth.email;
        options.group = group;

        options.url = `${HOST}${sails.config.application.urls.groupInvitation}` +
            `?token=${invitation.token}`;

        return this.sendMail(templatePath, options)
            .then(
                () => invitation
            );
    },

    sendMail(templatePath, options) {

        return ViewService.getEmailTemplate(templatePath, options)
            .then(
                (template) => {
                    mailerOptions.subject = template.subject;

                    return mailer('sendmail', mailerOptions)
                        .send({
                            to: options.email,
                            html: template.html
                        });
                });
    }
};

module.exports = MailerService;

