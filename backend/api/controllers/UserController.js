/*global sails, waterlock, User, UserService, FileService, Feedback*/

/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let UserController = waterlock.actions.user({
    getCurrentUser(req, res) {
        let user = req.session.user;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        UserService.getUser(user)
            .then(
                (foundUser) => {

                    return res.ok(
                        {
                            user: foundUser
                        }
                    );
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    findServiceProviders(req, res) {
        let params = req.allParams();

        if ((!params.southWestLatitude || !params.southWestLongitude) ||
            (!params.northEastLatitude || !params.northEastLongitude)) {

            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

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
    getUserFeedbacks(req, res) {
        let executor = req.params.user;

        if (!executor) {

            res.badRequest(
                {
                    message: req.__('Submitted data is invalid.')
                }
            );
        }

        Feedback.findByExecutor(executor)
            .populateAll()
            .then(
                (feedbacks) => res.ok(
                    {
                        feedbacks: feedbacks
                    }
                )
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    res.serverError();
                }
            );
    },
    updateUser(req, res) {
        let userId = req.session.user.id;
        let user = req.body;

        if (!userId) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        if (Object.keys(user).length === 0) {

            return res.badRequest({
                message: req.__('Please, check data.')
            });
        }

        if (user.password) {
            delete user.password;
        }

        if (user.id) {
            delete user.id;
        }

        FileService.saveAvatar(userId, user.portrait)
            .then(
                (file) => {

                    if (file) {
                        user.portrait = file;
                    }

                    return User.update({id: userId}, user);
                }
            )
            .then(
                (updatedUsers) => {

                    return UserService.getUser(updatedUsers[0]);
                }
            )
            .then(
                (foundUser) => {

                    return res.ok(
                        {
                            user: foundUser
                        }
                    );
                }
            )
            .catch(
                (err) => {
                    if (err) {
                        sails.log.error(err);

                        return res.serverError();
                    }

                    return res.notFound({
                        message: req.__('User not found.')
                    });
                }
            );
    }
});

module.exports = UserController;

