/*global async, sails, MailerService, UserService*/

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

let UserController = {
    getUser (req, res) {
        res.ok(
            {
                user: req.user
            }
        );
    },
    createUser(req, res) {
        let user = req.body;

        async.waterfall([
                async.apply(createUser, user),
                sendConfirmation
            ],
            (err, createdUser) => {
                if (err) {
                    sails.log.error(err);

                    return res.serverError();
                }

                res.created(
                    {
                        user: createdUser
                    }
                );
            });
    },
    updateUser(req, res) {
        let id = req.params.id;
        let user = req.body;

        if (!id || Object.keys(user).length === 0) {

            return res.badRequest({
                message: sails.__('Please, check data.')
            });
        }

        if (user.password) {
            delete user.password;
        }

        if (user.id) {
            delete user.id;
        }

        UserService.update({id: id}, user)
            .then((updatedUser) => res.ok(
                {
                    user: updatedUser
                }
            ))
            .catch(
                (err) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    return res.notFound({
                        message: sails.__('User not found.')
                    });
                }
            );
    }
};

function createUser(user, done) {
    UserService.create(user)
        .then(
            (createdUser) => {
                done(null, createdUser);
            }
        )
        .catch(
            (err) => {
                done(err);
            }
        );
}

function sendConfirmation(createdUser, done) {
    if (sails.config.application.emailVerificationEnabled) {
        MailerService.confirmRegistration(createdUser)
            .then(
                () => done(null, createdUser)
            )
            .catch(
                (err) => done(err)
            );
    } else {
        MailerService.successRegistration(createdUser)
            .then(
                () => done(null, createdUser)
            )
            .catch(
                (err) => done(err)
            );
    }
}

module.exports = UserController;