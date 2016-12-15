'use strict';

let splashPaymentRoutes ={
    //--- merchant no login ---
    //--- entity ?? ---
    'GET /api/splashpayment/merchants': {
        controller: 'splashPaymentController',
        action: 'getMerchants'
    },
    'GET /api/splashpayment/merchants/:merchantId': {
        controller: 'splashPaymentController',
        action: 'getMerchant'
    },
    'GET /api/splashpayment/createmerchant': { // replace with POST to /merchants
        controller: 'splashPaymentController',
        action: 'createMerchant'
    },
    'GET /api/splashpayment/updatemerchant/:merchantId': { // replace with PUT /merchants
        controller: 'splashPaymentController',
        action: 'updateMerchant'
    },
    /*todo: add DELETE URL (?)*/

    //--- transaction (txn) ---
    'POST /api/splashpayment/authtxn': {
     controller: 'splashPaymentController',
     action: 'createAuthTxn'
     },
    // ! support of urls below not implemented yet !
/*    'GET /api/splashpayment/txns': {
        controller: 'splashPaymentController',
        action: 'getMerchants'
    },
    'GET /api/splashpayment/txns/:merchantId': {
        controller: 'splashPaymentController',
        action: 'getMerchant'
    },
    'GET /api/splashpayment/txnscreate': { // replace with POST to /merchants
        controller: 'splashPaymentController',
        action: 'createMerchant'
    },
    'GET /api/splashpayment/txnsupdate/:merchantId': { // replace with PUT /merchants
        controller: 'splashPaymentController',
        action: 'updateMerchant'
    },*/
    /*todo: add DELETE URL (?)*/

    //--- customer ---
    'GET /api/splashpayment/customers': {
     controller: 'splashPaymentController',
     action: 'getCustomers'
     },
     'GET /api/splashpayment/customers/:customerId': {
     controller: 'splashPaymentController',
     action: 'getCustomer'
     },
     'GET /api/splashpayment/createcustomer': { // replace with POST to /customers
     controller: 'splashPaymentController',
     action: 'createCustomer'
     },
    'GET /api/splashpayment/updatecustomer/:customerId': { // replace with PUT /txns
     controller: 'splashPaymentController',
     action: 'updateCustomer'
     },
    /*todo: add DELETE URL (?)*/

    //--- payout: schedule of withdrawal ---
    /* Should be called for each Service provider on registration
     * entityId - id of merchant entity */
    'GET /api/splashpayment/merchantpayouts/:entityId': {
        controller: 'splashPaymentController',
        action: 'getMerchantPayouts'
    },
    /* entityId - id of merchant entity */
    'GET /api/splashpayment/createtpayout/:entityId': { // replace with POST to /payouts
        controller: 'splashPaymentController',
        action: 'createMerchantPayout'
    },
    'GET /api/splashpayment/updatepayout/:payoutId': { // replace with PUT to /payouts/:payoutId
        controller: 'splashPaymentController',
        action: 'updateMerchantPayout'
    },
};

module.exports.routes = splashPaymentRoutes;