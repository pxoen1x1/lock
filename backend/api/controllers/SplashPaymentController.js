/*global sails, SplashPaymentService*/

/**
 * SplashPaymentController
 *
 * @description :: Server-side logic for managing SplashPayment
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';


const BANK_ACCOUNT_TYPES = sails.config.splashpayment.bankAccountTypes;

let SplashPaymentController = {

    // merchant no login (/entities)
    // entity ??
    getBankAccountTypes(req, res) {
        return res.ok({
            result: BANK_ACCOUNT_TYPES
        });
    },

    getMerchants(req, res) {

        SplashPaymentService.getMerchants()
            .then((response) => res.ok({result: response}));

    },
    getMerchant(req, res) {

        let merchantId = req.params.merchantId;

        SplashPaymentService.getMerchant(merchantId)
            .then((response) => res.ok({result: response}));
    },
    createMerchant(req, res) {
        let user = req.session.user;

        SplashPaymentService.createMerchant(user, req.body)
            .then((response) => res.ok({result: response}));
    },
    updateMerchant(req, res) {

        SplashPaymentService.updateMerchant()
            .then((response) => res.ok({result: response}));
    },
// customer

    getCustomers(req, res) {

        SplashPaymentService.getCustomers()
            .then((response) => res.ok({result: response}));

    },
    getMerchantEntity(req, res){
        let user = req.session.user;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        if (!user.spMerchantId) {
            return res.ok({
                merchantEntity: null
            })
        }

        SplashPaymentService.getMerchantEntity(user.spMerchantId)
            .then((merchantEntity) => res.ok({merchantEntity: merchantEntity}))
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

        if (!user.spMerchantId) {
            return SplashPaymentService.createMerchantFull(user, params.merchantData, email)
                .then((merchantEntity) => res.ok({merchantEntity: merchantEntity}))
                .catch(
                    (err) => {
                        sails.log.error(err);

                        return res.serverError();
                    }
                );

        } else {
            SplashPaymentService.updateMerchantEntity(user.spMerchantId, params.merchantData)
                .then((merchantEntity) =>  res.ok({merchantEntity: merchantEntity}))
                .catch(
                    (err) => {
                        sails.log.error(err);

                        return res.serverError();
                    }
                );
        }
    },
    getMerchantAccounts(req, res){
        let user = req.session.user;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        SplashPaymentService.getMerchantAccounts(user.spMerchantId)
            .then((merchantAccounts) => res.ok({userPayment: merchantAccounts}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },

    setMerchantAccount(req, res){
        let user = req.session.user;

        if (!user) {

            return res.forbidden({
                message: req.__('You are not permitted to perform this action.')
            });
        }

        SplashPaymentService.setMerchantAccount(user, req.body)
            .then((userPayment) => res.ok({userPayment: userPayment}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },

    getCustomer(req, res) {

        let customerId = req.params.customerId;

        SplashPaymentService.getCustomer(customerId)
            .then((response) => res.ok({result: response}));
    },

    createCustomer(req, res) {

        SplashPaymentService.createCustomer()
            .then((response) => res.ok({result: response}));
    },

    updateCustomer(req, res) {
        let customerId = req.params.customerId;

        SplashPaymentService.updateCustomer(customerId)
            .then((response) => res.ok({result: response}));
    },
// transaction (txn)

    //--- payout ---
    getMerchantPayouts(req, res) {
        let entityId = req.params.entityId;

        SplashPaymentService.getMerchantPayouts(entityId)
            .then((response) => res.ok({result: response}));
    },
    createMerchantPayout(req, res) {
        let entityId = req.params.entityId;

        SplashPaymentService.createMerchantPayout(entityId)
            .then((response) => res.ok({result: response}));
    },
    updateMerchantPayout(req, res) {
        let payoutId = req.params.payoutId;

        SplashPaymentService.updateMerchantPayout(payoutId)
            .then((response) => res.ok({result: response}));
    },
    createAuthTxn(req, res) {
        var params = req.allParams();

        SplashPaymentService.createAuthTxn(params)
            .then((response) => res.ok({result: response}));
    },

};

module.exports = SplashPaymentController;
