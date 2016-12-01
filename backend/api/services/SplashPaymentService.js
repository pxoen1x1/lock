/*global Promise*/

'use strict';

let SplashPaymentService = {

    getMerchants(){
        var options = {
            method: 'GET',
            path: '/merchants'
        };

        return this.makeRequest(options);
    },
    getMerchant(entityId){
        var options = {
            method: 'GET',
            path: '/merchants/'+entityId
        };

        return this.makeRequest(options);
    },
    createMerchant(){
        var options = {
            method: 'POST',
            path: '/entities'
        };
        var bodyJson = {
        merchant: {
            members: [{
                primary: 1,
                country: "USA",
                address1: "6565 Taft St.",
                city: "Hollywood",
                state: "FL",
                zip: "33024",
                phone: "7185069292",
                first: "Nochum",
                last: "Sossonko",
                dob: "19750101",
                title: "CEO",
                ownership: 8500,
                email: "nochum@payrix.com"
            }],
                established: "20060101",
                new: 0,
                annualCCSales: "500000",
                status: "0",
                mcc: "1750" // ??
        },
        accounts: [{
            primary: 1,
            account: {
                method: 8,
                routing: "123456789",
                number: "1234567890"
            }
        }],
            //"login": "g1abcdefghijklm", // why login field exists in NO login example?
            name: "Splash Merchant2",
            email: "nochum@payrix.com",
            phone: "7185069292",
            address1: "6565 Taft St.",
            city: "Hollywood",
            state: "FL",
            zip: "33024",
            country: "USA",
            website: "http://www.splashpayments.com",
            type: "2",
            ein: "123456789"
    };
        return this.makeRequest(options,bodyJson);
    },
    updateMerchant(id){
        var options = {
            method: 'GET',
            path: '/merchants/'+id
        };
        //var bodyJson = {
        //    entity: "g1583ed19c0f985",
        var bodyJson = {
            merchant: {
                established: "20060101",
                new: 0,
                annualCCSales: "500000",
                status: "0",
                mcc: "1750" // ??
            },
            accounts: [{
                primary: 1,
                account: {
                    method: 8,
                    routing: "123456789",
                    number: "1234567890"
                }
            }],
            //"login": "g1abcdefghijklm", // why login field exists in NO login example?
            name: "Splash Merchant2",
            email: "nochum@payrix.com",
            phone: "7185069292",
            address1: "6565 Taft St.",
            city: "Hollywood",
            state: "FL",
            zip: "33024",
            country: "USA",
            website: "http://www.splashpayments.com",
            type: "2",
            ein: "123456789"
        };

        return this.makeRequest(options,bodyJson);
    },

    getMerchantPayouts(entityId){
        var options = {
            method: 'GET',
            path: '/payouts',
            headers:{'SEARCH':'entity[equals]='+entityId}
        };
        return this.makeRequest(options);
    },

    createMerchantPayout(entityId){
        // get active account
        var accountResponsePromise = this.getMerchantAccounts(entityId);
        return accountResponsePromise.then((accountResponse)=>{
            var response = JSON.parse(accountResponse);
            var data = response.response.data;
            if(data.lehgth = 0) return false; // ??? what to return if wrong data received ???

            var accountToken = data[0].token;

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
                 start: "20161201" // today
             };
             return this.makeRequest(options,bodyJson);
            //return accountResponse;
        });
    },

    getMerchantAccounts(entityId){
        var options = {
                method: 'GET',
                path: '/accounts',
                headers:{'SEARCH':'entity[equals]='+entityId}
            }; //+'&and[][active][equals]=1&and[][verified][equals]=1'} //??
        return this.makeRequest(options);
    },


    makeRequest(options, bodyJson){
    const https = require('https');

    options.host = 'test-api.splashpayments.com';
    options.headers = {}; // ??? todo replace
    options.headers['Content-Type'] = 'application/json';
    options.headers['APIKEY'] = '33629206d38422c644df7e0d9d7838b0';


    // return new pending promise
    return new Promise((resolve, reject) => {

    var req = https.request(options, (res) => {
        // temporary data holder
        const body = [];
        res.on('data', (chunk) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        res.on('end', () => resolve(body.join('')));
    });

    var body = JSON.stringify(bodyJson);
    req.end(body);

        req.on('error', (e) => {
            console.error(e);
    });


    })
    }
};

module.exports = SplashPaymentService;