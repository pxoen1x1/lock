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

        if (!user.spMerchantId) {
            return res.ok({
                merchantEntity: null
            });
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

        return this._saveMerchant(user, params, email)
            .then((merchantEntity) => res.ok({merchantEntity: merchantEntity}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    _saveMerchant(user, params, email) {
        if (!user.spMerchantId) {

            return SplashPaymentService.createMerchantFull(user, params.merchantData, email)
                .then((merchantEntity) => res.ok({merchantEntity: merchantEntity}));
        }

        return SplashPaymentService.updateMerchantEntity(user.spMerchantId, params.merchantData);
    },
    getMerchantAccounts(req, res){
        let user = req.session.user;

        if (!user.spMerchantId) {
            return res.ok({
                userPayment: null
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

        SplashPaymentService.setMerchantAccount(user, req.body)
            .then((userPayment) => res.ok({userPayment: userPayment}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },

    getMerchantFunds(req, res){
        let user = req.session.user;

        if (!user.spMerchantId) {
            return res.ok({
                merchantFunds: null
            });
        }

        SplashPaymentService.getMerchantFunds(user.spMerchantId)
            .then((merchantFunds) => res.ok({merchantFunds: merchantFunds}))
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
            .then((response) => res.ok({result: response}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },

    createCustomer(req, res) {

        SplashPaymentService.createCustomer()
            .then((response) => res.ok({result: response}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },

    updateCustomer(req, res) {
        let customerId = req.params.customerId;

        SplashPaymentService.updateCustomer(customerId)
            .then((response) => res.ok({result: response}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },

    // transaction (txn)
    createAuthTxn(req, res) {
        var params = req.allParams();
        let user = req.session.user;

        SplashPaymentService.createAuthTxnByToken(user.spCustomerId, params)
            .then((response) => {
                var txnArr = JSON.parse(response);

                if (txnArr.length == 0) {
                    throw new Error('Transaction was not created');
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
            })
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    createCaptureTxn(req, res) {
        var params = req.allParams();

        RequestService.getRequestById({id: params.requestId})
            .then((request) => {

                return SplashPaymentService.createCaptureTxn(request.owner.spCustomerId, request.executor.spMerchantId, request.spAuthTxnId);
            })
            .then((response) => {
                var txnArr = JSON.parse(response);

                if (txnArr.length === 0) {

                    throw new Error('Transaction was not created');
                }

                return res.ok(
                    {
                        resTxn: true
                    }
                )

            })
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    createReverseAuthTxn(req, res) {
        var params = req.allParams();


        RequestService.getRequestById({id: params.requestId})
            .then((request) => {

                return [request, SplashPaymentService.createReverseAuthTxn(request.owner.spCustomerId, request.executor.spMerchantId, request.spAuthTxnId)];
            })
            .spread((request, response) => {
                var txnArr = JSON.parse(response);

                if (txnArr.length > 0) {
                    request.spAuthTxnId = null;

                    return RequestService.updateRequest(request);
                } else {

                    return Promise.reject('Error during creating reverse transaction');
                }

            })
            .then((request) => {

                return res.ok({
                    request: request
                });
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
            })
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    //--- payout ---
    getMerchantPayouts(req, res) {
        let entityId = req.params.entityId;

        SplashPaymentService.getMerchantPayouts(entityId)
            .then((response) => res.ok({result: response}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    createMerchantPayout(req, res) {
        let entityId = req.params.entityId;

        SplashPaymentService.createMerchantPayout(entityId)
            .then((response) => res.ok({result: response}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    isCreatedTodaysPayout(req, res) {
        let user = req.session.user;

        if (!user.spMerchantId) {
            return res.ok({
                result: false
            });
        }

        SplashPaymentService.getMerchantEntity(user.spMerchantId)
            .then((entity) => {
                return SplashPaymentService.isCreatedMerchantTodaysPayout(entity.id);
            })
            .then((created) => {

                res.ok({result: created});
            })
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    withdrawal(req, res) {
        let user = req.session.user;

        if (!user.spMerchantId) {
            res.serverError('merchant was not found');
        }

        SplashPaymentService.withdrawal(user.spMerchantId)
            .then((payoutArray) => {

                if (payoutArray.length <= 0) {
                    throw new Error('Payout request was not created');
                }

                res.ok({result: true});
            })
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    },
    updateMerchantPayout(req, res) {
        let payoutId = req.params.payoutId;

        SplashPaymentService.updateMerchantPayout(payoutId)
            .then((response) => res.ok({result: response}))
            .catch(
                (err) => {
                    sails.log.error(err);

                    return res.serverError();
                }
            );
    }
};

module.exports = SplashPaymentController;
