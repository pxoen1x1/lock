/* global sails, User, UserService */

'use strict';

let Promise = require('bluebird');
const https = require('https');
const SPLASH_PAYMENT = sails.config.splashpayment;

let SplashPaymentService = {
    getMerchants(){
        let options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.merchants
        };

        return SplashPaymentService.makeRequest(options);
    },

    getMerchant(entityId){
        let options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.merchants + '/' + entityId
        };

        return SplashPaymentService.makeRequest(options);
    },

    createMerchant(user, merchantData, email){
        let options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.entities
        };
        let bodyJson = {
            merchant: {
                members: [{
                    primary: 1,
                    // address if not required then not include
                    //country: "USA", // copy from fields below
                    //address1: "6565 Taft St.", // copy from fields below
                    //city: "Hollywood", // copy from fields below
                    //state: "FL", // copy from fields below
                    //zip: "33024", //  copy from fields below
                    phone: user.phoneNumber,
                    first: user.firstName,
                    last: user.lastName,
                    dob: SPLASH_PAYMENT.merchant.member.dob, // ! required
                    title: SPLASH_PAYMENT.merchant.member.title, // ! required
                    ownership: SPLASH_PAYMENT.merchant.member.ownership, // ! required
                    email: email
                }],
                //established: "20060101", // -
                new: SPLASH_PAYMENT.merchant.new, // An indicator that specifies whether the Merchant is new to credit
                                                  // card processing. A value of '1' means new
                annualCCSales: SPLASH_PAYMENT.merchant.annualCCSales, // ???
                status: SPLASH_PAYMENT.merchant.status,
                mcc: SPLASH_PAYMENT.merchant.mcc  // required.
            },
            accounts: [],
            name: user.lastName + ' ' + user.firstName,
            email: email,// !required
            phone: user.phoneNumber,
            address1: merchantData.address1, // !required
            city: merchantData.city, // !required
            state: merchantData.state, // !required
            zip: merchantData.zip, // !required
            country: SPLASH_PAYMENT.merchant.country, // USA
            //website: "http://www.splashpayments.com", // -
            type: SPLASH_PAYMENT.merchant.type, // if Group then set '2'
            //ein: "123456789" // Federal tax id number (not required for Sole Proprietorship)
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    createMerchantFull(user, merchantData, email){
        let merchantArray;

        return SplashPaymentService.createMerchant(user, merchantData, email)
            .then(
                (merchantResponse) => {
                    merchantArray = JSON.parse(merchantResponse);

                    if(!merchantArray[0] || !merchantArray[0].merchant) {
                        return Promise.reject('createMerchant error');
                    }

                    let merchant = {
                        id: user.id,
                        spMerchantId: merchantArray[0].merchant.id
                    };

                    return UserService.updateUser(merchant);
                }
            )
            .then(
                () => SplashPaymentService.getMerchantEntity(user.spMerchantId)
            )
            .then(
                (merchantEntity) => [merchantEntity, SplashPaymentService.addMerchantToGroup(merchantEntity.id)]
            )
            .spread(
                (merchantEntity) => merchantEntity
            );
    },

    updateMerchantEntity(id, merchantData){

        return SplashPaymentService.getMerchant(id)
            .then(
                (merchantResp) => {
                    let merchant = JSON.parse(merchantResp);

                    if (merchant.length === 0) {

                        return Promise.reject('Merchant was not found');
                    }

                    return merchant[0].entity;
                }
            )
            .then(
                (entityId) => {
                    let options = {
                        method: 'PUT',
                        path: `${SPLASH_PAYMENT.endpoints.entities}/${entityId}`
                    };

                    let bodyJson = {
                        address1: merchantData.address1,
                        state: merchantData.state,
                        city: merchantData.city,
                        zip: merchantData.zip
                    };

                    return SplashPaymentService.makeRequest(options, bodyJson);
                }
            )
            .then((merchantEntity) => {
                let merchantEntityArr = JSON.parse(merchantEntity);

                return merchantEntityArr[0];
            });
    },

    getCustomers(){
        let options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.customers
        };

        return SplashPaymentService.makeRequest(options);
    },

    getCustomer(entityId){
        let options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.customers + '/' + entityId
        };

        return SplashPaymentService.makeRequest(options);
    },

    createCustomer(user, email){ // customerData,
        let options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.customers
        };
        let bodyJson = {
            first: user.firstName, // auth.user.firstName
            last: user.lastName, // auth.user.lastName
            email: email, // auth.email
            //    address1: customerData.address1, // !! not defined. is it required ??
            //    city: customerData.city, // !! not defined. is it required ??
            //    state: customerData.state, // !! not defined. is it required ??
            //    zip: customerData.zip, // !! not defined. is it required ??
            phone: user.phoneNumber // auth.user.phoneNumber
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    updateCustomer(id, user, email, customerData){
        let options = {
            method: 'PUT',
            path: SPLASH_PAYMENT.endpoints.customers + '/' + id
        };

        let bodyJson = {
            first: user.firstName, // auth.user.firstName
            last: user.lastName, // auth.user.lastName
            email: email, // auth.email
            address1: customerData.address1, // !! not defined. is it required ??
            city: customerData.city, // !! not defined. is it required ??
            state: customerData.state, // !! not defined. is it required ??
            zip: customerData.zip, // !! not defined. is it required ??
            phone: user.phoneNumber // auth.user.phoneNumber

        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    getCustomerTokens(customerId){
        let options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.tokens,
            headers: {'SEARCH': 'customer[equals]=' + customerId}
        };

        return SplashPaymentService.makeRequest(options);
    },

    createCustomerToken(customerId, params){
        let options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.tokens
        };
        let firstNum = parseInt(params.number.charAt(0), 10);

        if (SPLASH_PAYMENT.payment_methods[firstNum].method === undefined) {

            return Promise.reject('This type of cards not supports');
        }

        let bodyJson = {
            'customer': customerId,
            'payment': {
                'method': SPLASH_PAYMENT.payment_methods[firstNum].method,
                'number': params.number,
                'cvv': params.cvv
            },
            'expiration': params.expiration
        };

        return SplashPaymentService.makeRequest(options, bodyJson)
            .then(
                (tokenData) => {
                    let tokens = JSON.parse(tokenData);

                    return tokens[0];
                }
            );
    },

    updateCustomerToken(user, spCustomerId, params) {

        return SplashPaymentService.deleteCustomerTokens(spCustomerId)
            .then(
                () => {

                    return SplashPaymentService.createCustomerToken(spCustomerId, params);
                }
            )
            .then(
                (token) => {
                    user.spCardNumber = token.payment.number;
                    return [token.payment.number, User.update({id: user.id}, user)];
                }
            )
            .spread((paymentNumber) => {

                return paymentNumber;
            });
    },

    deleteCustomerTokens(customerId){
        return SplashPaymentService.getCustomerTokens(customerId)
            .then((tokensString) => {
                let tokens = JSON.parse(tokensString);

                if (!tokens || tokens.length === 0) {

                    return Promise.resolve(); // nothing to delete
                }

                let arrayOfPromises = tokens.map(
                    (token) => {
                        let options = {
                            method: 'DELETE',
                            path: `${SPLASH_PAYMENT.endpoints.tokens}/${token.id}`
                        };

                        return SplashPaymentService.makeRequest(options);
                    }
                );

                return Promise.all(arrayOfPromises);
            });
    },

    getMerchantPayouts(entityId){
        let options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.payouts,
            headers: {
                'SEARCH': `entity[equals]=${entityId}`
            }
        };

        return SplashPaymentService.makeRequest(options);
    },

    createMerchantPayout(entityId, accountToken){
        let options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.payouts
        };

        let bodyJson = {
            entity: entityId,
            account: accountToken, // ??? like ece7798046b853d39a69446b621aad8b
            name: SPLASH_PAYMENT.payout.name,
            schedule: SPLASH_PAYMENT.payout.schedule,
            um: SPLASH_PAYMENT.payout.unitOfMeasure,
            amount: SPLASH_PAYMENT.payout.amount,
            start: SplashPaymentService._getDateString() // today
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    withdrawal(Id){

        return SplashPaymentService.getMerchantEntity(Id)
            .then(
                (merchantEntity) => {

                    return [merchantEntity, SplashPaymentService.isCreatedMerchantTodaysPayout(merchantEntity.id)];
                }
            )
            .spread(
                (merchantEntity, payoutCreated) => {
                    if (payoutCreated) {

                        return Promise.reject('Payout already created');
                    }

                    return [merchantEntity.id, SplashPaymentService.getMerchantAccounts(Id)];
                }
            )
            .spread(
                (entityId, accounts) => {
                    let accountToken = accounts[0].token;

                    let options = {
                        method: 'POST',
                        path: SPLASH_PAYMENT.endpoints.payouts
                    };

                    let bodyJson = {
                        entity: entityId,
                        account: accountToken, // ??? like ece7798046b853d39a69446b621aad8b
                        name: SPLASH_PAYMENT.payout.name,
                        schedule: SPLASH_PAYMENT.payout.schedule,
                        um: SPLASH_PAYMENT.payout.unitOfMeasure,
                        amount: SPLASH_PAYMENT.payout.amount,
                        start: SplashPaymentService._getDateString() // today
                    };

                    return SplashPaymentService.makeRequest(options, bodyJson);
                }
            )
            .then(
                (payoutResponse) => {
                    let payoutArray = JSON.parse(payoutResponse);

                    return payoutArray;
                }
            );
    },
    // not using yet
    updateMerchantPayout(payoutId){
        let options = {
            method: 'PUT',
            path: SPLASH_PAYMENT.endpoints.payouts + '/' + payoutId
        };

        let bodyJson = {
            name: 'Update2 payout',
            schedule: 1,
            um: 1,
            amount: 2000,
            start: SplashPaymentService._getDateString() // today
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },
    createMerchantFee(entityId){
        let options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.fees
        };

        let bodyJson = {
            name: SPLASH_PAYMENT.fee.name,
            um: SPLASH_PAYMENT.fee.unitOfMeasure,
            amount: SPLASH_PAYMENT.fee.amount,
            schedule: SPLASH_PAYMENT.fee.schedule,
            start: SplashPaymentService._getDateString(), // today
            //org: "g1abcdefghijklm",
            entity: sails.config.splashpaymentParams.serviceSplashPaymentEntityId, // service's entity
            forentity: entityId // service provider entity
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    addMerchantToGroup(entityId) {
        let options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.orgEntities
        };

        let bodyJson = {
            "org": sails.config.splashpaymentParams.merchantsGroupId,
            "entity": entityId
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    isCreatedMerchantTodaysPayout(entityId){
        let options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.payouts,
            headers: {
                'SEARCH': `and[][entity][equals]=${entityId} &and[][start][equals]=${this._getDateString()}`
            }
        };

        return SplashPaymentService.makeRequest(options)
            .then(
                (payoutsData) => {
                    let payouts = JSON.parse(payoutsData);

                    return payouts.length > 0;
                }
            );
    },

    getMerchantEntity(Id){

        return this.getMerchant(Id)
            .then(
                (merchantResp) => {
                    let merchant = JSON.parse(merchantResp);

                    if (merchant.length === 0) {

                        return Promise.reject('Merchant was not found');
                    }

                    let options = {
                        method: 'GET',
                        path: SPLASH_PAYMENT.endpoints.entities + '/' + merchant[0].entity
                    };

                    return SplashPaymentService.makeRequest(options);
                }
            )
            .then(
                (merchantEntity) => {
                    let merchantEntityArr = JSON.parse(merchantEntity);

                    return merchantEntityArr[0];
                }
            );
    },

    getMerchantFunds(Id){

        return this.getMerchant(Id)
            .then(
                (merchantResp) => {
                    let merchant = JSON.parse(merchantResp);

                    if (merchant.length === 0) {

                        return Promise.reject('merchant was not found');
                    }

                    let options = {
                        method: 'GET',
                        path: SPLASH_PAYMENT.endpoints.funds,
                        headers: {
                            'SEARCH': `entity[equals]=${merchant[0].entity}`
                        }
                    };

                    return SplashPaymentService.makeRequest(options);
                }
            )
            .then((merchantFundsResponse) => {
                let merchantFundsArr = JSON.parse(merchantFundsResponse);

                return merchantFundsArr[0];
            });
    },

    getMerchantAccounts(Id){

        return this.getMerchant(Id)
            .then(
                (merchantResp) => {
                    let merchant = JSON.parse(merchantResp);

                    if (merchant.length === 0) {

                        return Promise.reject('Merchant was not found');
                    }

                    let options = {
                        method: 'GET',
                        path: SPLASH_PAYMENT.endpoints.accounts,
                        headers: {
                            'SEARCH': `entity[equals]=${merchant[0].entity}`
                        }
                    };

                    return SplashPaymentService.makeRequest(options);
                }
            )
            .then(
                (merchantAccounts) => JSON.parse(merchantAccounts)
            );
    },

    setMerchantAccount(user, paymentData) {

        return SplashPaymentService.getMerchantAccounts(user.spMerchantId)
            .then(
                (merchantAccounts) => {

                    if (merchantAccounts.length === 0) {

                        return SplashPaymentService.createMerchantAccount(user.spMerchantId, paymentData);
                    } else {

                        return SplashPaymentService.updateMerchantAccount(merchantAccounts[0].id, paymentData);
                    }
                }
            );
    },

    createMerchantAccount(Id, paymentData){

        return SplashPaymentService.getMerchant(Id)
            .then(
                (merchant) => {
                    let merchantResonse = JSON.parse(merchant);
                    let entityId = merchantResonse[0].entity;
                    let options = {
                        method: 'POST',
                        path: SPLASH_PAYMENT.endpoints.accounts
                    };

                    let bodyJson = {
                        'entity': entityId, // merchant entity like "g158418cf1e8276"
                        'account': {
                            'method': paymentData.method, // The type of the Account.
                                                          // This field is specified as an integer.
                                                          // Valid values are:
                                                          // '8': Checking account
                                                          // '9': Savings account
                                                          // '10': Corporate checking account, and
                                                          // '11': Corporate savings account
                            'routing': paymentData.routing,
                            'number': paymentData.number
                        },
                        'name': '******' +
                        paymentData.number.substring(paymentData.number.length - 4, paymentData.number.length),  // get
                                                                                                                 // number
                                                                                                                 // and
                                                                                                                 // hide
                                                                                                                 // all
                                                                                                                 // symbols
                                                                                                                 // except
                                                                                                                 // 4
                                                                                                                 // last
                        'primary': SPLASH_PAYMENT.account.primary, // always 1 cause only one account allowed
                        'status': SPLASH_PAYMENT.account.status, //  '0': Not Ready. The account holder is not yet
                                                                 // ready to verify the Account. '1': Ready. The
                                                                 // account is ready to be verified. '2': Challenged -
                                                                 // the account has processed the challenge. '3':
                                                                 // Verified. The Account has been verified. '4':
                                                                 // Manual. There has been an issue during
                                                                 // verification, and further attempts to verify the
                                                                 // Account will require manual intervention.
                        'currency': SPLASH_PAYMENT.account.currency // only USD supported
                    };

                    return SplashPaymentService.makeRequest(options, bodyJson);
                }
            )
            .then(
                (response) => JSON.parse(response)
            );
    },

    updateMerchantAccount(accountId, paymentData){
        let options = {
            method: 'PUT',
            path: SPLASH_PAYMENT.endpoints.accounts + '/' + accountId
        };

        let bodyJson = {
            'account': {
                'method': paymentData.method,
                'routing': paymentData.routing,
                'number': paymentData.number
            },
            'name': '******' + paymentData.number.substring(paymentData.number.length - 4, paymentData.number.length),
            // get number and hide all symbols except 4 last
        };

        return SplashPaymentService.makeRequest(options, bodyJson)
            .then(
                (response) => JSON.parse(response)
            );
    },

    deleteMerchantAccounts(merchantId){

        return SplashPaymentService.getMerchantAccounts(merchantId)
            .then(
                (accountsString) => {
                    let accounts = JSON.parse(accountsString);

                    if (!accounts || accounts.lenght === 0) {

                        return Promise.resolve(); // nothing to delete
                    }

                    let arrayOfPromises = accounts.map(
                        (account) => {
                            let options = {
                                method: 'DELETE',
                                path: SPLASH_PAYMENT.endpoints.accounts + '/' + account.id
                            };

                            return SplashPaymentService.makeRequest(options);
                        }
                    );

                    return Promise.all(arrayOfPromises);
                }
            );
    },

    createAuthTxnByToken(spCustomerId, params) {

        return SplashPaymentService.getCustomerTokens(spCustomerId)
            .then(
                (tokensRes) => {
                    let tokens = JSON.parse(tokensRes);

                    return tokens[0].token;
                }
            ).then(
                (token) => {

                    return SplashPaymentService.createAuthTxn(token, params);
                }
            );
    },

    createAuthTxn(token, params){
        let options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.txns
        };

        let bodyJson = {
            token: token,
            merchant: params.merchantId,
            total: params.amount * 100, // total amount in cents
            type: SPLASH_PAYMENT.txn.types.auth,
            origin: SPLASH_PAYMENT.txn.origin
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    createCaptureTxn(spCustomerId, merchantId, fortxn){

        return SplashPaymentService.getCustomerTokens(spCustomerId)
            .then(
                (tokensRes) => {
                    let tokens = JSON.parse(tokensRes);

                    return tokens[0].token;
                }
            )
            .then(
                (token) => {
                    let options = {
                        method: 'POST',
                        path: SPLASH_PAYMENT.endpoints.txns
                    };

                    let bodyJson = {
                        token: token,
                        fortxn: fortxn,
                        merchant: merchantId,
                        type: SPLASH_PAYMENT.txn.types.capture,
                        origin: SPLASH_PAYMENT.txn.origin
                    };

                    return SplashPaymentService.makeRequest(options, bodyJson);
                }
            );
    },

    createReverseAuthTxn(spCustomerId, merchantId, fortxn){

        return SplashPaymentService.getCustomerTokens(spCustomerId)
            .then(
                (tokensRes) => {
                    let tokens = JSON.parse(tokensRes);

                    return tokens[0].token;
                }
            )
            .then(
                (token) => {
                    let options = {
                        method: 'POST',
                        path: SPLASH_PAYMENT.endpoints.txns
                    };

                    let bodyJson = {
                        token: token,
                        fortxn: fortxn,
                        merchant: merchantId,
                        type: SPLASH_PAYMENT.txn.types.authReversal,
                        origin: SPLASH_PAYMENT.txn.origin
                    };

                    return SplashPaymentService.makeRequest(options, bodyJson);
                }
            );
    },

    createTokenAndAuthTxn(user, params) {

        return SplashPaymentService.deleteCustomerTokens(user.spCustomerId)
            .then(
                () => SplashPaymentService.createCustomerToken(user.spCustomerId, params.txnData)
            )
            .then(
                (token) => {
                    if (!token) {

                        return Promise.reject('Error during saving payment info');
                    }


                    let userToUpdate = {
                        id: user.id,
                        spCardNumber: token.payment.number
                    };
                    return [token, UserService.updateUser(userToUpdate)];
                }
            )
            .spread(
                (token, updatedUsers) => [
                    updatedUsers.spCardNumber,
                    SplashPaymentService.createAuthTxn(token.token, params)
                ]
            )
            .spread(
                (spCardNumber, txnData) => {
                    let txnArr = JSON.parse(txnData);
                    let request = {
                        id: params.requestId,
                        spAuthTxnId: txnArr[0].id
                    };

                    return [spCardNumber, txnArr, RequestService.updateRequest(request)];
                }
            );
    },

    makeRequest(options, bodyJson){
        options.host = sails.config.splashpaymentParams.host;

        if (!options.headers) {
            options.headers = {};
        }

        options.headers['Content-Type'] = SPLASH_PAYMENT.contentType;
        options.headers.APIKEY = sails.config.splashpaymentParams.apikey;


        // return new pending promise
        return new Promise(
            (resolve, reject) => {
                let req = https.request(options, (res) => {
                    // temporary data holder
                    const body = [];

                    res.on('data', (chunk) => {
                        let response = JSON.parse(chunk);

                        if (!response.response || !response.response.data) {
                            let date = new Date();
                            sails.log.debug(date);
                            sails.log.debug('unhandled response from SP');
                            sails.log.debug(response);
                            sails.log.debug(date);

                            return reject('unhandled response from SP');
                        }

                        body.push(JSON.stringify(response.response.data));
                    });

                    // we are done, resolve promise with those joined chunks
                    res.on('end', () => resolve(body.join('')));
                });

                let body = JSON.stringify(bodyJson);

                req.end(body);

                req.on('error', (e) => {
                    sails.log.error(e);
                });
            });
    },
    _getDateString(){
        let d = new Date();

        let day = d.getDate();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        return String(year) + String(month) + String(day);
    }
};

module.exports = SplashPaymentService;