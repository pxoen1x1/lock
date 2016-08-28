/* global async, sails, MailerService, UserService */

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

let UserController = {
    getCurrentUser(req, res) {
        res.ok(
            {
                user: req.user
            }
        );
    },
    findServiceProviders(req, res) {
        let params = req.allParams();

        UserService.findServiceProviders(params)
            .then(
                (serviceProviders) => res.ok({
                    serviceProviders: serviceProviders
                })
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    createUser(req, res) {
        let user = req.body;

        async.waterfall([
                async.apply(createUser, user),
                createAssociations,
                sendConfirmation,
                getCreatedUser
            ],
            (err, user) => {
                if (err) {
                    sails.log.error(err);

                    return res.serverError();
                }

                res.created(
                    {
                        user: user
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

module.exports = UserController;

function createUser(user, done) {
    UserService.create(user)
        .then(
            (createdUser) => done(null, createdUser, user.address, user.details)
        )
        .catch(
            (err) => done(err)
        );
}

function createAssociations(createdUser, address, userDetails, done) {
    if (!address && !userDetails) {

        return done(null, createdUser);
    }

    createdUser.addresses.add(address);
    createdUser.userDetail.add(userDetails);

    createdUser.save(
        (err) => {
            if (err) {

                return done(err);
            }

            done(null, createdUser);
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

function getCreatedUser(createdUser, done) {
    UserService.getUser(createdUser)
        .then(
            (foundUser) => done(null, foundUser)
        )
        .catch(
            (err) => done(err)
        );
}