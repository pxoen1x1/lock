/*global sails, SplashPaymentService*/

/**
 * SplashPaymentController
 *
 * @description :: Server-side logic for managing SplashPayment
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

let SplashPaymentController = {

    // merchant no login (/entities)
    // entity ??
    getMerchants(req, res) {

        SplashPaymentService.getMerchants()
            .then((response) => {

                return res.ok({
                    result: response
                });
            });

    },
    getMerchant(req, res) {

    let merchantId = req.params.merchantId;

        SplashPaymentService.getMerchant(merchantId)
            .then((response) => {

                return res.ok({
                    result: response
                });
            });
    },
    createMerchant(req, res) {
    let user = req.session.user;

        SplashPaymentService.createMerchant(user, req.body)
            .then((response) => {

                return res.ok({
                    result: response
                });
            });
    },
    updateMerchant(req, res) {

        SplashPaymentService.updateMerchant()
            .then((response) => {

                return res.ok({
                    result: response
                });
            });
    },
// customer

    getCustomers(req, res) {

        SplashPaymentService.getCustomers()
            .then((response) => {

            return res.ok({
                result: response
            });
    });

    },

    getCustomer(req, res) {

        let customerId = req.params.customerId;

        SplashPaymentService.getCustomer(customerId)
            .then((response) => {

            return res.ok({
                result: response
            });
    });
    },

    createCustomer(req, res) {

        SplashPaymentService.createCustomer()
            .then((response) => {

            return res.ok({
                result: response
            });
    });
    },

    updateCustomer(req, res) {
    let customerId = req.params.customerId;

        SplashPaymentService.updateCustomer(customerId)
            .then((response) => {

            return res.ok({
                result: response
            });
    });
    },
// transaction (txn)

    //--- payout ---
    getMerchantPayouts(req, res) {
    let entityId = req.params.entityId;

        SplashPaymentService.getMerchantPayouts(entityId)
            .then((response) => {

            return res.ok({
                result: response
            });
    });
    },
    createMerchantPayout(req, res) {
    let entityId = req.params.entityId;

        SplashPaymentService.createMerchantPayout(entityId)
            .then((response) => {

            return res.ok({
                result: response
            });
    });
    },
    updateMerchantPayout(req, res) {
    let payoutId = req.params.payoutId;

        SplashPaymentService.updateMerchantPayout(payoutId)
            .then((response) => {

            return res.ok({
                result: response
            });
    });
    },

};

module.exports = SplashPaymentController;
