'use strict';
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let UserController = {
    getUser (req, res) {
        res.send(req.user);
    },
    createUser (req, res) {
        let user = req.body;

        async.waterfall([
                async.apply(createUser, user)
            ],
            (err, createdUser) => {
                if (err) {
                    sails.log.error(err);

                    return res.serverError();
                }

                res.ok(createdUser);

                if (sails.config.application.emailVerificationEnabled) {
                    MailerService.confirmRegistration(createdUser);
                } else {
                    MailerService.successRegistration(createdUser);
                }
            });
    },
    updateUser (req, res) {
        let id = req.params.id;
        let user = req.body;

        if (!id || Object.keys(user).length === 0) {

            return res.badRequest({message: 'Please, check data.'});
        }

        if (user.password) {
            delete user.password;
        }

        if (user.id) {
            delete user.id;
        }

        User.update({id: id}, user)
            .exec(
                (err, updatedUser) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    if (updatedUser.length === 0) {

                        return res.notFound({message: 'User not found.'});
                    }

                    res.ok(
                        {
                            user: updatedUser[0]
                        }
                    );
                }
            );
    },
    confirmRegistration (req, res) {
        let token = req.param('token');

        if (!token) {

            return res.badRequest({message: 'Token is not defined'});
        }

        User.findOne({
            token: token
        }).exec((err, user) => {
            if (err) {
                sails.log.error(err);

                return res.serverError();
            }

            if (!user) {

                return res.notFound({message: 'User not found.'});
            }

            user.token = '';
            user.emailConfirmed = true;
            user.enabled = true;

            user.save(
                (err) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    res.ok();
                }
            );
        });
    }
};

module.exports = UserController;

