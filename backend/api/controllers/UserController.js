'use strict';
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let UserController = {
    getUser (request, response) {
        response.ok(request.user);
    },
    createUser(request, response) {
        let user = request.body;

        async.waterfall([
                async.apply(createUser, user)
            ],
            (error, createdUser) => {
                if (error) {
                    sails.log.error(error);

                    return response.serverError();
                }

                response.created(createdUser);

                if (sails.config.application.emailVerificationEnabled) {
                    MailerService.confirmRegistration(createdUser);
                } else {
                    MailerService.successRegistration(createdUser);
                }
            });
    },
    updateUser(request, response) {
        let id = request.params.id;
        let user = request.body;

        if (!id || Object.keys(user).length === 0) {

            return response.badRequest({
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
                (error, updatedUser) => {
                    if (error) {
                        sails.log.error(error);

                        return response.serverError();
                    }

                    if (updatedUser.length === 0) {

                        return response.notFound({
                            message: sails.__('User not found.')
                        });
                    }

                    response.ok(
                        {
                            user: updatedUser[0]
                        }
                    );
                }
            );
    },
    confirmEmail(request, response) {
        let token = request.param('token');

        if (!token) {

            return response.badRequest(sails.__('Token is not defined.'));
        }

        User.findOne({
            token: token
        }).exec((error, user) => {
            if (error) {
                sails.log.error(error);

                return response.serverError();
            }

            if (!user) {

                return response.notFound(sails.__('User not found.'));
            }

            user.token = '';
            user.emailConfirmed = true;
            user.enabled = true;

            user.save(
                (error) => {
                    if (error) {
                        sails.log.error(error);

                        return response.serverError();
                    }

                    response.redirect(sails.config.homePage);
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
            (error) => done(error)
        );
}

module.exports = UserController;

