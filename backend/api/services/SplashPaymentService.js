/*global Promise*/

'use strict';

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
            path: '/merchants/'+entityId
        };

        return SplashPaymentService.makeRequest(options);
    },

    createMerchant(user,merchantData, email){
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
                dob: "19750101", // ! required
                title: "Director", // if no required then not inculde for individuals
                ownership: 10000, // ! required
                email: email
            }],
            //established: "20060101", // -
        new: 0, // An indicator that specifies whether the Merchant is new to credit card processing. A value of '1' means new
        annualCCSales: "500000", // ???
        status: "0",
        mcc: "1750"  // required.
        },
        accounts: [],
            name: user.lastName +' '+user.firstName,
            email: email,// !required
            phone: user.phoneNumber,
            address1: merchantData.address1, // !required
            city: merchantData.city, // !required
            state: merchantData.state, // !required
            zip: merchantData.zip, // !required
            country: "USA", // USA
            //website: "http://www.splashpayments.com", // -
            /**
             * Company type (+0 = Sole Proprietorship, 1 = Corporation, 2 = LLC,
             * 3 = Partnership, +4 = Association, 5 = Non Profit, 6 = Governmental)
             */
            type: "0", // if Group then set '2'
            //ein: "123456789" // Federal tax id number (not required for Sole Proprietorship)
    };
        return SplashPaymentService.makeRequest(options,bodyJson);
    },

    updateMerchantEntity(id, merchantData){

        return SplashPaymentService.getMerchant(id)
            .then(function(merchantResp){
                var merchant = JSON.parse(merchantResp);
                if(merchant.length == 0){
                    return false; // todo: should return promiise?? Promise.reject('merchant not created yet');
                }
                    return merchant[0].entity;
            })
            .then(function(entityId){
                var options = {
                    method: 'PUT',
                    path: '/entities/'+entityId
                };

                var bodyJson = {
                    address1: merchantData.address1,
                    state: merchantData.state,
                    city: merchantData.city,
                    zip: merchantData.zip
                };

                return SplashPaymentService.makeRequest(options,bodyJson);
    }).catch(console.log.bind(console));

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
            path: '/customers/'+entityId
        };

        return SplashPaymentService.makeRequest(options);
    },

    createCustomer(auth){

        var options = {
            method: 'POST',
            path: '/customers'
        };
        var bodyJson = {
            first: auth.user.firstName, // auth.user.firstName
            last: auth.user.lastName, // auth.user.lastName
            email: auth.email, // auth.email
         //   address1: "address 1", // !! not defined. is it required ??
        //    city: "New York", // !! not defined. is it required ??
            phone: auth.user.phoneNumber // auth.user.phoneNumber

        };
        return SplashPaymentService.makeRequest(options,bodyJson);
    },

    updateCustomer(id){
        var options = {
            method: 'PUT',
            path: '/customers/'+id
        };

        var bodyJson = {
            first: "FirstnameUPDATED"
        };

        return SplashPaymentService.makeRequest(options,bodyJson);
    },

    getMerchantPayouts(entityId){
        var options = {
            method: 'GET',
            path: '/payouts',
            headers:{'SEARCH':'entity[equals]='+entityId}
        };
        return SplashPaymentService.makeRequest(options);
    },

    createMerchantPayout(entityId,accountToken){

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
             return SplashPaymentService.makeRequest(options,bodyJson);
    },

    updateMerchantPayout(payoutId){
        var options = {
            method: 'PUT',
            path: '/payouts/'+payoutId
        };

        var bodyJson = {
            name: "Update2 payout",
            schedule: 1,
            um: 1,
            amount: 2000,
            start: "20161202" // today
        };

        return SplashPaymentService.makeRequest(options,bodyJson);
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

        return SplashPaymentService.makeRequest(options,bodyJson);
    },

    getMerchantEntity(Id){

        return this.getMerchant(Id).then((merchantResp)=>{
                var merchant = JSON.parse(merchantResp);
                if(merchant.length == 0){
                    return false; // todo: should return promiise?? Promise.reject('merchant not created yet');
                }

                var options = {
                    method: 'GET',
                    path: '/entities/'+merchant[0].entity
                };
                return SplashPaymentService.makeRequest(options);
        }).catch(console.log.bind(console));
    },

    getMerchantAccounts(Id){

        return this.getMerchant(Id).then((merchantResp)=>{
                var merchant = JSON.parse(merchantResp);
                if(merchant.length == 0){
                    return false; // todo: should return promiise?? Promise.reject('merchant not created yet');
                }

                var options = {
                    method: 'GET',
                    path: '/accounts',
                    headers:{'SEARCH':'entity[equals]='+merchant[0].entity}
                };
                return SplashPaymentService.makeRequest(options);
        }).catch(console.log.bind(console));
    },

    createMerchantAccounts(Id,paymentData){

        return SplashPaymentService.getMerchant(Id)
            .then(function(merchant){
                var merchantResonse = JSON.parse(merchant);
                var entityId = merchantResonse[0].entity;
                var options = {
                    method: 'POST',
                    path: '/accounts'
                };

                var bodyJson = {
                    "entity":entityId, // merchant entity like "g158418cf1e8276"
                    "account": {
                        "method": "8", // The type of the Account. This field is specified as an integer. Valid values are: '8': Checking account '9': Savings account '10': Corporate checking account, and '11': Corporate savings account
                        "routing": paymentData.routing,
                        "number": paymentData.number
                    },
                    "name":"******" + paymentData.number.substring(paymentData.number.length-4, paymentData.number.length),  // get number and hide all symbols except 4 last
                    "primary":"1", // always 1 cause only one account allowed
                    "status":"0", //  '0': Not Ready. The account holder is not yet ready to verify the Account. '1': Ready. The account is ready to be verified. '2': Challenged - the account has processed the challenge. '3': Verified. The Account has been verified. '4': Manual. There has been an issue during verification, and further attempts to verify the Account will require manual intervention.
                    "currency":"USD" // only USD supported
                };

                return SplashPaymentService.makeRequest(options,bodyJson);
            }).catch(function (err) {
                console.log(err);
            });
    },

    updateMerchantAccount(accountId,paymentData){
        var options = {
            method: 'PUT',
            path: '/accounts/'+accountId
        };

        var bodyJson = {
            "account": {
                "routing": paymentData.routing,
                "number": paymentData.number
            },
            "name":"******" + paymentData.number.substring(paymentData.number.length-4, paymentData.number.length),  // get number and hide all symbols except 4 last
        };

        return SplashPaymentService.makeRequest(options,bodyJson);
    },

    deleteMerchantAccounts(merchantId){
        return SplashPaymentService.getMerchantAccounts(merchantId)
            .then((accountsString)=>{
                var accounts = JSON.parse(accountsString);
                if(!accounts || accounts.lenght == 0){
                    return false;
                }
                var arrayOfPromises = accounts.map(function(account){
                    var options = {
                        method: 'DELETE',
                        path: '/accounts/'+account.id
                    };

                    return SplashPaymentService.makeRequest(options);
                });
                return Promise.all(arrayOfPromises);
            });
    },


    makeRequest(options, bodyJson){
    const https = require('https');

    options.host = 'test-api.splashpayments.com';
    if(!options.headers){
        options.headers = {};
    }
    options.headers['Content-Type'] = 'application/json';
    options.headers['APIKEY'] = '33629206d38422c644df7e0d9d7838b0';


    // return new pending promise
    return new Promise((resolve, reject) => {

        var req = https.request(options, (res) => {
            // temporary data holder
            const body = [];
            res.on('data', (chunk) =>
            {
                var response = JSON.parse(chunk);
                if(!response.response || !response.response.data){
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
        if(day < 10) { day = '0'+day;}
        var month = d.getMonth() +1;
        if(month < 10) { month = '0'+month;}
        var year = d.getFullYear();
        return String(year) + String(month) + String(day);
    }
};

module.exports = SplashPaymentService;