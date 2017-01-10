/* global sails, waterlock, User, UserService, FileService, SplashPaymentService */

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
    getCustomer(req, res){
        let user = req.session.user;

        if (!user.spCustomerId) {

            return res.badRequest({
                message: req.__('User has not Customer Id.')
            });
        }

        SplashPaymentService.getCustomer(user.spCustomerId)
            .then(
                (customer) => {

                    return res.ok(
                        {
                            customer: JSON.parse(customer)
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
    updateCustomer(req, res){
        let user = req.session.user;
        let params = req.allParams();

        if (!user.spCustomerId) {
            // Splash Payment customer creates on registration
            return res.forbidden({
                message: req.__('User has not Customer Id.')
            });
        }

        UserService.getUser(user)
            .then((foundUser) => {

                return SplashPaymentService
                    .updateCustomer(user.spCustomerId, user, foundUser.auth.email, params.customerData);
            })
            .then((customer) => {
                return res.ok(
                    {
                        customer: JSON.parse(customer)
                    });
            })
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                });
    },
    updateCustomerCard(req, res){
        let user = req.session.user;
        //let userId = req.session.user.id;
        let params = req.allParams();


        if (!user.spCustomerId) {
            return res.badRequest({
                message: req.__('User has not Customer Id.')
            });
        }

        SplashPaymentService.updateCustomerToken(user, user.spCustomerId, params)
            .then(
                (spCardNumber) => {
                    return res.ok(spCardNumber);
                }
            )
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                });
    },
    getUserById(req, res) {
        let userId = req.params.id;

        if (!userId) {

            return res.badRequest({
                message: req.__('Submitted data is invalid.')
            });
        }

        UserService.getUser({id: userId})
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
    updateUser(req, res) {
        let userId = req.session.user.id;
        let user = req.body;

        if (Object.keys(user).length === 0) {

            return res.badRequest({
                message: req.__('Please, check data.')
            });
        }

        if (user.details) {
            user.userDetail = user.details;

            delete user.details;
        }

        let dir = 'avatars';

        FileService.saveImage(userId, user.portrait, dir)
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

