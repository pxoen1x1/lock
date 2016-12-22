/*global Promise*/

'use strict';

let MERCHANT = sails.config.splashpayment.merchant;

let SplashPaymentService = {

    getMerchants(){
        var options = {
            method: 'GET',
            path: '/merchants'
        };

        return SplashPaymentService.makeRequest(options);
    },

    getMerchant(entityId){
        var options = {
            method: 'GET',
            path: '/merchants/' + entityId
        };

        return SplashPaymentService.makeRequest(options);
    },

    createMerchant(user, merchantData, email){
        var options = {
            method: 'POST',
            path: '/entities'
        };
        var bodyJson = {
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
                    dob: MERCHANT.member.dob, // ! required
                    title: MERCHANT.member.title, // ! required
                    ownership: MERCHANT.member.ownership, // ! required
                    email: email
                }],
                //established: "20060101", // -
                new: MERCHANT.new, // An indicator that specifies whether the Merchant is new to credit card processing. A value of '1' means new
                annualCCSales: MERCHANT.annualCCSales, // ???
                status: MERCHANT.status,
                mcc: MERCHANT.mcc  // required.
            },
            accounts: [],
            name: user.lastName + ' ' + user.firstName,
            email: email,// !required
            phone: user.phoneNumber,
            address1: merchantData.address1, // !required
            city: merchantData.city, // !required
            state: merchantData.state, // !required
            zip: merchantData.zip, // !required
            country: MERCHANT.country, // USA
            //website: "http://www.splashpayments.com", // -
            type: MERCHANT.type, // if Group then set '2'
            //ein: "123456789" // Federal tax id number (not required for Sole Proprietorship)
        };
        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    updateMerchantEntity(id, merchantData){

        return SplashPaymentService.getMerchant(id)
            .then(function (merchantResp) {
                var merchant = JSON.parse(merchantResp);
                if (merchant.length == 0) {
                    return false; // todo: should return promiise?? Promise.reject('merchant not created yet');
                }
                return merchant[0].entity;
            })
            .then(function (entityId) {
                var options = {
                    method: 'PUT',
                    path: '/entities/' + entityId
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
            path: '/customers'
        };

        return SplashPaymentService.makeRequest(options);
    },

    getCustomer(entityId){
        var options = {
            method: 'GET',
            path: '/customers/' + entityId
        };

        return SplashPaymentService.makeRequest(options);
    },

    createCustomer(user, email){ // customerData,

        var options = {
            method: 'POST',
            path: '/customers'
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
            path: '/customers/' + id
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
            path: '/tokens',
            headers: {'SEARCH': 'customer[equals]=' + customerId}
        };
        return SplashPaymentService.makeRequest(options);
    },

    createCustomerToken(customerId, params){
        var options = {
            method: 'POST',
            path: '/tokens'
        };

        var bodyJson = {
            "customer": customerId,
            "payment": {
                "method": SplashPaymentService.getPaymentMethod(params.txnData.cardNumber),
                "number": params.txnData.cardNumber,
                "cvv": params.txnData.cvv
            },
            "expiration": params.txnData.expiration
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    deleteCustomerTokens(customerId){
        return SplashPaymentService.getCustomerTokens(customerId)
            .then((tokensString)=> {
                var tokens = JSON.parse(tokensString);
                if (!tokens || tokens.length == 0) {
                    return false;
                }
                var arrayOfPromises = tokens.map(function (token) {
                    var options = {
                        method: 'DELETE',
                        path: '/tokens/' + token.id
                    };

                    return SplashPaymentService.makeRequest(options);
                });
                return Promise.all(arrayOfPromises);
            });
    },

    getMerchantPayouts(entityId){
        var options = {
            method: 'GET',
            path: '/payouts',
            headers: {'SEARCH': 'entity[equals]=' + entityId}
        };
        return SplashPaymentService.makeRequest(options);
    },

    createMerchantPayout(entityId, accountToken){

        var options = {
            method: 'POST',
            path: '/payouts'
        };

        var bodyJson = {
            entity: entityId,
            account: accountToken, // ??? like ece7798046b853d39a69446b621aad8b
            name: "Daily payout",
            schedule: 1,
            um: 1,
            amount: 10000,
            start: SplashPaymentService.getDateString() // today
        };
        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    updateMerchantPayout(payoutId){
        var options = {
            method: 'PUT',
            path: '/payouts/' + payoutId
        };

        var bodyJson = {
            name: "Update2 payout",
            schedule: 1,
            um: 1,
            amount: 2000,
            start: "20161202" // today
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    createMerchantFee(entityId){

        var options = {
            method: 'POST',
            path: '/fees'
        };

        var bodyJson = {
            "name": "Service Fee",
            "um": "1",
            "amount": 2500,
            "schedule": "7",
            "start": SplashPaymentService.getDateString(), // today
            //"org": "g1abcdefghijklm",
            "forentity": sails.config.serviceSplashPaymentEntityId, // service provider entity
            "entity": entityId // service's entity
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
                path: '/entities/' + merchant[0].entity
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
                path: '/accounts',
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
                        accountsArray = merchantAccounts;
                        return SplashPaymentService.getMerchantEntity(user.spMerchantId);
                    })
                    .then((merchantEntity)=> {
                        SplashPaymentService.createMerchantPayout(merchantEntity.id, accountsArray[0].token);
                        return accountsArray;
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
                    path: '/accounts'
                };

                var bodyJson = {
                    "entity": entityId, // merchant entity like "g158418cf1e8276"
                    "account": {
                        "method": paymentData.method, // The type of the Account. This field is specified as an integer. Valid values are: '8': Checking account '9': Savings account '10': Corporate checking account, and '11': Corporate savings account
                        "routing": paymentData.routing,
                        "number": paymentData.number
                    },
                    "name": "******" + paymentData.number.substring(paymentData.number.length - 4, paymentData.number.length),  // get number and hide all symbols except 4 last
                    "primary": "1", // always 1 cause only one account allowed
                    "status": "0", //  '0': Not Ready. The account holder is not yet ready to verify the Account. '1': Ready. The account is ready to be verified. '2': Challenged - the account has processed the challenge. '3': Verified. The Account has been verified. '4': Manual. There has been an issue during verification, and further attempts to verify the Account will require manual intervention.
                    "currency": "USD" // only USD supported
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
            path: '/accounts/' + accountId
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
                    return false;
                }
                var arrayOfPromises = accounts.map(function (account) {
                    var options = {
                        method: 'DELETE',
                        path: '/accounts/' + account.id
                    };

                    return SplashPaymentService.makeRequest(options);
                });
                return Promise.all(arrayOfPromises);
            });
    },

    createTxn(token, params){
        var options = {
            method: 'POST',
            path: '/txns'
        };

        var bodyJson = {
            token: token,
            merchant: params.merchantId,
            amount: params.amount,
            /**
             * Type of transaction (1 = Sale, 2 = Auth, 3 = Capture, 4 = Auth Reversal,
             * 5 = Refund, 6 = Reserved for future use, 7 = eCheck Sale,
             * 8 = eCheck Refund, 9 = eCheck PreSale Notification, 10 = eCheck PreRefund
             * Notification, 11 = eCheck Retry failed sale, 12 = eCheck Verification, 13 =
             * eCheck Sale/Retry Cancellation
             */
            type: 1,
            /**
             * The transaction origin (1 = Terminal, 2 = eCommerce, 3 = Mail Order or
             * Telephone Order)
             */
            "origin": 2
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    createAuthTxn(params){

        var method = SplashPaymentService.getPaymentMethod(params.cardNumber);

        var options = {
            method: 'POST',
            path: '/txns'
        };

        var bodyJson = {
            "payment": {
                /**
                 * Method of payment (1 = American Express, 2 = Visa, 3 = Master Card,
                 * 4 = Diners Club, 5 = Discover, 6 = Paypal [not yet implemented],
                 * 7 = Debit Card, 8 = eCheck Checking, 9 = eCheck Savings, 10 = eCheck
                 * Corporate Checking, 11 = eCheck Corporate Savings)
                 *
                 *  AMEX starts with a 3
                 VISA starts with a 4
                 MC starts with a 5
                 DISCOVER starts with a 6
                 */
                "method": method,
                "number": params.cardNumber,//"4242424242424242",
                "cvv": params.cvv
            },
            "expiration": "0120",
            /**
             * Type of transaction (1 = Sale, 2 = Auth, 3 = Capture, 4 = Auth Reversal,
             * 5 = Refund, 6 = Reserved for future use, 7 = eCheck Sale,
             * 8 = eCheck Refund, 9 = eCheck PreSale Notification, 10 = eCheck PreRefund
             * Notification, 11 = eCheck Retry failed sale, 12 = eCheck Verification, 13 =
             * eCheck Sale/Retry Cancellation
             */
            "type": "2",
            /**
             * Transaction amount in cents
             */
            "total": 5000,
            "address1": "6565 Taft St.",
            "city": "Hollywood",
            "state": "FL",
            "zip": "33024",
            "email": "nochum@payrix.com",
            "phone": "7185069292",
            "first": "Nochum",
            "last": "Sossonko",
            /**
             * Merchant ID that is running this transaction
             */
            "merchant": "g1abcdefghijklm",
            /**
             * The transaction origin (1 = Terminal, 2 = eCommerce, 3 = Mail Order or
             * Telephone Order)
             */
            "origin": 2
        };

        return SplashPaymentService.makeRequest(options, bodyJson);
    },

    makeRequest(options, bodyJson){
        const https = require('https');

        options.host = 'test-api.splashpayments.com'; // todo: move to constants
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Content-Type'] = 'application/json';
        options.headers['APIKEY'] = '33629206d38422c644df7e0d9d7838b0'; // todo: move to constants


        // return new pending promise
        return new Promise((resolve, reject) => {

            var req = https.request(options, (res) => {
                // temporary data holder
                const body = [];
                res.on('data', (chunk) => {
                    var response = JSON.parse(chunk);
                    if (!response.response || !response.response.data) {
                        console.log(response);
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
                console.error(e);
            });


        })
    },
    getDateString(){

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
    },

    getPaymentMethod(cardNumber)
    {
        var method = 0;
        var firstNum = cardNumber.charAt(0);

        /**
         * Method of payment (1 = American Express, 2 = Visa, 3 = Master Card,
         * 4 = Diners Club, 5 = Discover, 6 = Paypal [not yet implemented],
         * 7 = Debit Card, 8 = eCheck Checking, 9 = eCheck Savings, 10 = eCheck
         * Corporate Checking, 11 = eCheck Corporate Savings)
         *
         *  AMEX starts with a 3
         VISA starts with a 4
         MC starts with a 5
         DISCOVER starts with a 6
         */
        switch (firstNum) {
            case "3":
                method = 1;
                break;
            case "4":
                method = 2;
                break;
            case "5":
                method = 3;
                break;
            default:
                return false; //Promise.reject("Incorrect card number"); // nothing happens! unhandled rejection
        }

        return method;
    }
};

module.exports = SplashPaymentService;