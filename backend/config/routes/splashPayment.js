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
    // IS IT REQUIRED??
/*    'GET /api/splashpayment/txns': {
     controller: 'splashPaymentController',
     action: 'getMerchants'
     },
     'GET /api/splashpayment/txns/:merchantId': {
     controller: 'splashPaymentController',
     action: 'getMerchant'
     },
     'GET /api/splashpayment/txnscreate': { // replace with POST to /txns
     controller: 'splashPaymentController',
     action: 'createMerchant'
     },
     'GET /api/splashpayment/txnsupdate/:merchantId': { // replace with PUT /txns
     controller: 'splashPaymentController',
     action: 'updateMerchant'
     },*/
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