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

        SplashPaymentService.createMerchant()
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

// transaction (txn)
// customer

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

};

module.exports = SplashPaymentController;
