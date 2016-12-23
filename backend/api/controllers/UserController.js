/* global sails, waterlock, User, UserService, FileService */

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

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        if (!user.spCustomerId) {
            return res.ok({
                customer: false
            })
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
        var user = req.session.user;
        var params = req.allParams();

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        if (!user.spCustomerId) {
            // Splash Payment customer creates on registration
            return false; // todo: return errors
        }

        UserService.getUser(user)
            .then((foundUser) => {
                return SplashPaymentService.updateCustomer(user.spCustomerId, user, foundUser.auth.email, params.customerData)
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
        var user = req.session.user;
        //let userId = req.session.user.id;
        var params = req.allParams();


        if (!user.spCustomerId) {
            return false; // todo: return errors
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
    createTxn(req, res) {
        var params = req.allParams();
        let user = req.session.user;

        SplashPaymentService.createTxnFull(user.spCustomerId, params)
            .then((response) => {
            return res.ok({
                resTxn: JSON.parse(response)
            });
        });
    },
    createTokenAndTxn(req, res) {
        let params = req.allParams();
        let user = req.session.user;

        return SplashPaymentService.createTokenAndTxn(user, params)
            .spread((spCardNumber, txnData) => {
                return res.ok({
                    resTxn: JSON.parse(txnData),
                    spCardNumber: spCardNumber
                });
            });
    },
    getUserById(req, res) {
        let userId = req.params.id;

        if (!userId) {

            return res.badRequest({
                message: req.__('You are not permitted to perform this action.')
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

        if (user.password) {
            delete user.password;
        }

        if (user.id) {
            delete user.id;
        }

        if (user.details) {
            if (user.details.rating) {
                delete user.details.rating;
            }

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

