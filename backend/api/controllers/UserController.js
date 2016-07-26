'use strict';
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let UserController = {
    getUser (req, res) {
        res.ok(req.user);
    },
    createUser(req, res) {
        let user = req.body;

        async.waterfall([
                async.apply(createUser, user)
            ],
            (err, createdUser) => {
                if (err) {
                    sails.log.error(err);

                    return res.serverError();
                }

                res.created(createdUser);

                if (sails.config.application.emailVerificationEnabled) {
                    MailerService.confirmRegistration(createdUser);
                } else {
                    MailerService.successRegistration(createdUser);
                }
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

        User.update({id: id}, user)
            .exec(
                (err, updatedUser) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    if (updatedUser.length === 0) {

                        return res.notFound({
                            message: sails.__('User not found.')
                        });
                    }

                    res.ok(
                        {
                            user: updatedUser[0]
                        }
                    );
                }
            );
    },
    confirmEmail(req, res) {
        let token = req.param('token');

        if (!token) {

            return res.badRequest(sails.__('Token is not defined.'));
        }

        User.findOne({
            token: token
        }).exec((err, user) => {
            if (err) {
                sails.log.error(err);

                return res.serverError();
            }

            if (!user) {

                return res.notFound(sails.__('User not found.'));
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

                    res.redirect(sails.config.homePage);
                }
            );
        });
    }
};

function createUser(user, done) {
    UserService.create(user)
        .then(
            (createdUser) => done(null, createdUser)
        )
        .catch(
            (err) => done(err)
        );
}

module.exports = UserController;

