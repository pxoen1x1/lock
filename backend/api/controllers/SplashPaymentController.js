/*global sails, SplashPaymentService*/

/**
 * SplashPaymentController
 *
 * @description :: Server-side logic for managing SplashPayment
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';


const BANK_ACCOUNT_TYPES = sails.config.splashpayment.bankAccountTypes;
const TRANSACTION_TYPES = sails.config.splashpayment.txn.types;

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
            return SplashPaymentService.updateMerchantEntity(user.spMerchantId, params.merchantData)
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
    createAuthTxn(req, res) {
        var params = req.allParams();
        let user = req.session.user;

        SplashPaymentService.createAuthTxnByToken(user.spCustomerId, params)
            .then((response) => {
                var txnArr = JSON.parse(response);

                if(txnArr.length == 0){
                    return res.serverError();
                }

                return [txnArr, RequestService.getRequestById({id: params.requestId})];
            })
            .spread((txnArr, request) => {
                request.spAuthTxnId = txnArr[0].id;

                return [txnArr, RequestService.updateRequest(request)];
            })
            .then((txnArr) => {

                return res.ok({
                    resTxn: txnArr
                })
            });
    },
    createCaptureTxn(req, res) {
        var params = req.allParams();

        RequestService.getRequestById({id: params.requestId})
            .then((request) => {

                return SplashPaymentService.createCaptureTxn(request.executor.spMerchantId, request.spAuthTxnId)
            })
            .then((response) => {
                var txnArr = JSON.parse(response);

                if(txnArr.length > 0){
                    return res.ok({
                        resTxn: true
                    })
                }else{
                    return res.serverError();
                }

            });
    },
    createTokenAndAuthTxn(req, res) {
        let params = req.allParams();
        let user = req.session.user;

        return SplashPaymentService.createTokenAndAuthTxn(user, params)
            .spread((spCardNumber, txnData) => {
                return res.ok({
                    resTxn: JSON.parse(txnData),
                    spCardNumber: spCardNumber
                });
            });
    },
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
    }
};

module.exports = SplashPaymentController;
