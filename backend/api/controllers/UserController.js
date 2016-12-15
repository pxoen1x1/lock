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

        if(!user.spCustomerId){
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
        var email = params.auth.email;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        if(!user.spCustomerId){
            return false; // todo: return errors
        }
/*            return SplashPaymentService.createCustomer(user, params.customerData, email) //,
                    .then((customerResponse)=>{
                        customerArray = JSON.parse(customerResponse);
                        user.spCustomerId = customerArray[0].customer.id;

                        UserService.update({id: user.id}, user);

                        return res.ok(
                            {
                                merchantEntity: customerArray
                            }
                        );
                    })
                    .catch(
                            (err) => {
                            sails.log.error(err);

                        return res.serverError();
                    }
                    );*/
    //    }else{
            SplashPaymentService.updateCustomer(user.spCustomerId, params.customerData)
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
    //    }
    },
    getMerchantEntity(req, res){
        let user = req.session.user;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        if(!user.spMerchantId){
            return res.ok({
                merchantEntity: []
            })
        }

        SplashPaymentService.getMerchantEntity(user.spMerchantId)
            .then(
                (merchantEntity) => {

            return res.ok(
                {
                    merchantEntity: JSON.parse(merchantEntity)
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
    updateMerchantEntity(req, res){
        var user = req.session.user;
        var params = req.allParams();
        var email = params.auth.email;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        if(!user.spMerchantId){
            var merchantEntityArr;
            var merchantArray;
            return SplashPaymentService.createMerchant(user,params.merchantData,email)
                    .then((merchantResponse)=>{
                        merchantArray = JSON.parse(merchantResponse);
                        user.spMerchantId = merchantArray[0].merchant.id;

                        UserService.update({id: user.id}, user);
                        return SplashPaymentService.getMerchantEntity(user.spMerchantId);
                    })
                    .then((merchantEntityRes)=>{
                        merchantEntityArr = JSON.parse(merchantEntityRes);
                        return SplashPaymentService.createMerchantFee(merchantEntityArr[0].id);
                    })
                    .then(
                        (feeResult) => {
                        return res.ok(
                            {
                                merchantEntity: merchantEntityArr
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
        }else{
            SplashPaymentService.updateMerchantEntity(user.spMerchantId,params.merchantData)
                .then(
                    (merchantEntity) => {
                return res.ok(
                    {
                        merchantEntity: JSON.parse(merchantEntity)
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
        }
    },
    getCurrentUserPayment(req, res){
        let user = req.session.user;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        UserService.getUserPayment(user)
            .then(
                (userPayment) => {

            return res.ok(
                {
                    userPayment: userPayment
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
    setCurrentUserPayment(req, res){
        let user = req.session.user;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        UserService.setUserPayment(user, req.body)
            .then(
                (userPayment) => {

            return res.ok(
                {
                    userPayment: userPayment
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

