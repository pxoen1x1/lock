/*global Promise*/

'use strict';

let Promise = require('bluebird');

let SPLASH_PAYMENT = sails.config.splashpayment;

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
                new: SPLASH_PAYMENT.merchant.new, // An indicator that specifies whether the Merchant is new to credit card processing. A value of '1' means new
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

        var merchantArray;

        return SplashPaymentService.createMerchant(user, merchantData, email)
            .then((merchantResponse) => {
                merchantArray = JSON.parse(merchantResponse);
                user.spMerchantId = merchantArray[0].merchant.id;

                return UserService.update({id: user.id}, user);
            })
            .then(() => SplashPaymentService.getMerchantEntity(user.spMerchantId))
            .then((merchantEntity) => [merchantEntity, SplashPaymentService.createMerchantFee(merchantEntity.id)]);
    },

    updateMerchantEntity(id, merchantData){

        return SplashPaymentService.getMerchant(id)
            .then(function (merchantResp) {
                var merchant = JSON.parse(merchantResp);
                if (merchant.length == 0) {

                    return Promise.reject('merchant not created yet');
                }

                return merchant[0].entity;
            })
            .then(function (entityId) {
                var options = {
                    method: 'PUT',
                    path: SPLASH_PAYMENT.endpoints.entities + '/' + entityId
                };

                var bodyJson = {
                    address1: merchantData.address1,
                    state: merchantData.state,
                    city: merchantData.city,
                    zip: merchantData.zip
                };

                return SplashPaymentService.makeRequest(options, bodyJson)
                    .then((merchantEntity) => {
                        var merchantEntityArr = JSON.parse(merchantEntity);
                        return merchantEntityArr[0];
                    });
            });

    },

    getCustomers(){
        var options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.customers
        };

        return SplashPaymentService.makeRequest(options);
    },

    getCustomer(entityId){
        var options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.customers +'/' + entityId
        };

        return SplashPaymentService.makeRequest(options);
    },

    createCustomer(user, email){ // customerData,

        var options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.customers
        };
        var bodyJson = {
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
        var options = {
            method: 'PUT',
            path: SPLASH_PAYMENT.endpoints.customers + '/' + id
        };

        var bodyJson = {
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
        var options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.tokens,
            headers: {'SEARCH': 'customer[equals]=' + customerId}
        };
        return SplashPaymentService.makeRequest(options);
    },

    createCustomerToken(customerId, params){
        var options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.tokens
        };

        let firstNum = parseInt(params.number.charAt(0), 10);
        if(SPLASH_PAYMENT.payment_methods[firstNum].method == undefined){

            return Promise.reject('This type of cards not supports');
        }

        var bodyJson = {
            "customer": customerId,
            "payment": {
                "method": SPLASH_PAYMENT.payment_methods[firstNum].method,
                "number": params.number,
                "cvv": params.cvv
            },
            "expiration": params.expiration
        };

        return SplashPaymentService.makeRequest(options, bodyJson)
            .then((tokenData) =>{
                var tokens = JSON.parse(tokenData);
                return tokens[0];
            });
    },

    updateCustomerToken(user, spCustomerId, params) {

        return SplashPaymentService.deleteCustomerTokens(spCustomerId)
            .then(() => {

                return SplashPaymentService.createCustomerToken(spCustomerId, params)
            })
            .then((token) => {

                return [token.payment.number, User.update({id: user.id}, user)];
            })
            .spread((paymentNumber, updatedUser) => {

                return paymentNumber;
            });
    },

    deleteCustomerTokens(customerId){
        return SplashPaymentService.getCustomerTokens(customerId)
            .then((tokensString)=> {
                var tokens = JSON.parse(tokensString);
                if (!tokens || tokens.length == 0) {

                    return Promise.resolve(); // nothing to delete
                }
                var arrayOfPromises = tokens.map(function (token) {
                    var options = {
                        method: 'DELETE',
                        path: SPLASH_PAYMENT.endpoints.tokens + '/' + token.id
                    };

                    return SplashPaymentService.makeRequest(options);
                });
                return Promise.all(arrayOfPromises);
            });
    },

    getMerchantPayouts(entityId){
        var options = {
            method: 'GET',
            path: SPLASH_PAYMENT.endpoints.payouts,
            headers: {'SEARCH': 'entity[equals]=' + entityId}
        };
        return SplashPaymentService.makeRequest(options);
    },

    createMerchantPayout(entityId, accountToken){

        var options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.payouts
        };

        var bodyJson = {
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
    // not using yet
    updateMerchantPayout(payoutId){
        var options = {
            method: 'PUT',
            path: SPLASH_PAYMENT.endpoints.payouts + '/' + payoutId
        };

        var bodyJson = {
            name: "Update2 payout",
            schedule: 1,
            um: 1,
            amount: 2000,
            start: SplashPaymentService._getDateString() // today
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    createMerchantFee(entityId){

        var options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.fees
        };

        var bodyJson = {
            name: SPLASH_PAYMENT.fee.name,
            um: SPLASH_PAYMENT.fee.unitOfMeasure,
            amount: SPLASH_PAYMENT.fee.amount,
            schedule: SPLASH_PAYMENT.fee.schedule,
            start: SplashPaymentService._getDateString(), // today
            //org: "g1abcdefghijklm",
            forentity: sails.config.serviceSplashPaymentEntityId, // service provider entity
            entity: entityId // service's entity
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    getMerchantEntity(Id){

        return this.getMerchant(Id).then((merchantResp)=> {
            var merchant = JSON.parse(merchantResp);
            if (merchant.length == 0) {
                return false; // todo: should return promiise?? Promise.reject('merchant not created yet');
            }

            var options = {
                method: 'GET',
                path: SPLASH_PAYMENT.endpoints.entities + '/' + merchant[0].entity
            };
            return SplashPaymentService.makeRequest(options)
                .then((merchantEntity) => {
                    var merchantEntityArr = JSON.parse(merchantEntity);
                    return merchantEntityArr[0];
                });
        });
    },

    getMerchantAccounts(Id){

        return this.getMerchant(Id).then((merchantResp)=> {
            var merchant = JSON.parse(merchantResp);
            if (merchant.length == 0) {
                return false; // todo: should return promiise?? Promise.reject('merchant not created yet');
            }

            var options = {
                method: 'GET',
                path: SPLASH_PAYMENT.endpoints.accounts,
                headers: {'SEARCH': 'entity[equals]=' + merchant[0].entity}
            };
            return SplashPaymentService.makeRequest(options)
                .then((merchantAccounts) => {
                    return JSON.parse(merchantAccounts);
                });
        });
    },

    setMerchantAccount(user, paymentData) {

        return SplashPaymentService.getMerchantAccounts(user.spMerchantId).then((merchantAccounts)=> {
            var accountsArray;

            if (merchantAccounts.length == 0) {
                return SplashPaymentService.createMerchantAccount(user.spMerchantId, paymentData)
                    .then((merchantAccounts)=> {
                        return merchantAccounts;
                    });
            } else {
                return SplashPaymentService.updateMerchantAccount(merchantAccounts[0].id, paymentData)
                    .then(function (merchantAccounts) {
                        return merchantAccounts;
                    })
            }
        });

    },

    createMerchantAccount(Id, paymentData){

        return SplashPaymentService.getMerchant(Id)
            .then(function (merchant) {
                var merchantResonse = JSON.parse(merchant);
                var entityId = merchantResonse[0].entity;
                var options = {
                    method: 'POST',
                    path: SPLASH_PAYMENT.endpoints.accounts
                };

                var bodyJson = {
                    "entity": entityId, // merchant entity like "g158418cf1e8276"
                    "account": {
                        "method": paymentData.method, // The type of the Account. This field is specified as an integer. Valid values are: '8': Checking account '9': Savings account '10': Corporate checking account, and '11': Corporate savings account
                        "routing": paymentData.routing,
                        "number": paymentData.number
                    },
                    "name": "******" + paymentData.number.substring(paymentData.number.length - 4, paymentData.number.length),  // get number and hide all symbols except 4 last
                    "primary": SPLASH_PAYMENT.account.primary, // always 1 cause only one account allowed
                    "status": SPLASH_PAYMENT.account.status, //  '0': Not Ready. The account holder is not yet ready to verify the Account. '1': Ready. The account is ready to be verified. '2': Challenged - the account has processed the challenge. '3': Verified. The Account has been verified. '4': Manual. There has been an issue during verification, and further attempts to verify the Account will require manual intervention.
                    "currency": SPLASH_PAYMENT.account.currency // only USD supported
                };

                return SplashPaymentService.makeRequest(options, bodyJson)
                    .then(createMerchantAccountComplete);

                function createMerchantAccountComplete(response) {

                    return JSON.parse(response);
                }
            });
    },

    updateMerchantAccount(accountId, paymentData){
        var options = {
            method: 'PUT',
            path: SPLASH_PAYMENT.endpoints.accounts + '/' + accountId
        };

        var bodyJson = {
            "account": {
                "method": paymentData.method,
                "routing": paymentData.routing,
                "number": paymentData.number
            },
            "name": "******" + paymentData.number.substring(paymentData.number.length - 4, paymentData.number.length),  // get number and hide all symbols except 4 last
        };

        return SplashPaymentService.makeRequest(options, bodyJson)
            .then(updateMerchantAccountComplete);

        function updateMerchantAccountComplete(response) {

            return JSON.parse(response)
        }
    },

    deleteMerchantAccounts(merchantId){
        return SplashPaymentService.getMerchantAccounts(merchantId)
            .then((accountsString)=> {
                var accounts = JSON.parse(accountsString);
                if (!accounts || accounts.lenght == 0) {
                    return Promise.resolve(); // nothing to delete
                }
                var arrayOfPromises = accounts.map(function (account) {
                    var options = {
                        method: 'DELETE',
                        path: SPLASH_PAYMENT.endpoints.accounts + '/' + account.id
                    };

                    return SplashPaymentService.makeRequest(options);
                });
                return Promise.all(arrayOfPromises);
            });
    },

    createAuthTxnByToken(spCustomerId, params) {
        return SplashPaymentService.getCustomerTokens(spCustomerId, params)
            .then((tokensRes)=> {
                var tokens = JSON.parse(tokensRes);
                return tokens[0].token;
            }).then((token) => {
            return SplashPaymentService.createAuthTxn(token, params);
        })
    },

    createAuthTxn(token, params){
        var options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.txns
        };

        var bodyJson = {
            token: token,
            merchant: params.merchantId,
            total: params.amount * 100, // total amount in cents
            type: SPLASH_PAYMENT.txn.types.auth,
            origin: SPLASH_PAYMENT.txn.origin
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    createCaptureTxn(merchantId, fortxn){
        var options = {
            method: 'POST',
            path: SPLASH_PAYMENT.endpoints.txns
        };

        var bodyJson = {
            fortxn: fortxn,
            merchant: merchantId,
            type: SPLASH_PAYMENT.txn.types.capture,
            origin: SPLASH_PAYMENT.txn.origin
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    createTokenAndAuthTxn(user, params) {
        var token = {}; // todo: use spread ??
        return SplashPaymentService.deleteCustomerTokens(user.spCustomerId)
            .then(() => {

                return SplashPaymentService.createCustomerToken(user.spCustomerId, params.txnData)
            })
            .then((tokenRes) => {
                if (!tokenRes) {
                    return Promise.reject('Error during saving payment info')
                }
                token = tokenRes;
                user.spCardNumber = token.payment.number;

                return User.update({id: user.id}, user);  // todo: use spread ??
            }).then((updatedUsers) => {

                return [updatedUsers[0].spCardNumber,SplashPaymentService.createAuthTxn(token.token, params)];
            })
    },

    makeRequest(options, bodyJson){
        const https = require('https');

        options.host = SPLASH_PAYMENT.host;
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Content-Type'] = SPLASH_PAYMENT.contentType;
        options.headers['APIKEY'] = SPLASH_PAYMENT.apikey;


        // return new pending promise
        return new Promise((resolve, reject) => {

            var req = https.request(options, (res) => {
                // temporary data holder
                const body = [];
                res.on('data', (chunk) => {
                    var response = JSON.parse(chunk);
                    if (!response.response || !response.response.data) {
                        sails.log.error(response);
                        return Promise.reject('unhandled response from SP');
                    }
                    body.push(JSON.stringify(response.response.data));
                });
                // we are done, resolve promise with those joined chunks
                res.on('end', () => resolve(body.join('')));
            });

            var body = JSON.stringify(bodyJson);
            req.end(body);

            req.on('error', (e) => {
                sails.log.error(e);
            });


        })
    },
    _getDateString(){

        var d = new Date();
        var day = d.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var year = d.getFullYear();
        return String(year) + String(month) + String(day);
    }
};

module.exports = SplashPaymentService;