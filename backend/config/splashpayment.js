'use strict';

let splashpayment = {
    host : 'test-api.splashpayments.com',
    contentType : 'application/json',

    endpoints: {
        merchants: '/merchants',
        entities: '/entities',
        customers: '/customers',
        tokens: '/tokens',
        payouts: '/payouts',
        fees: '/fees',
        orgEntities: '/orgEntities',
        accounts: '/accounts',
        txns: '/txns',
        funds: '/funds',
    },
    bankAccountTypes: [
        {code: 8, name: 'CHECKING_ACCOUNT'},
        {code: 9, name: 'SAVINGS_ACCOUNT'},
        {code: 10, name: 'CORPORATE_CHECKING_ACCOUNT'},
        {code: 11, name: 'CORPORATE_SAVINGS_ACCOUNT'}
    ],
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
    payment_methods: {
        3: {
            name: 'American Express',
            method: 1
        },
        4: {
            name: 'Visa',
            method: 2
        },
        5: {
            name: 'Master Card',
            method: 3
        }
    },
    merchant: {
        member: {
            dob: '19750101',
            title: 'Director',
            ownership: 10000
        },
        new: 0,
        annualCCSales: '500000',
        status: 1,
        mcc: '7399',
        country: 'USA',
        //website: "http://www.splashpayments.com", // -
        /**
         * Company type (+0 = Sole Proprietorship, 1 = Corporation, 2 = LLC,
         * 3 = Partnership, +4 = Association, 5 = Non Profit, 6 = Governmental)
         */
        type: 0 // if Group then set '2'
    },
    payout: {
        name: 'Withdrawal request',
        /** '1': Daily - the Payout is paid every day. '2': Weekly - the Payout is paid every week. '3': Monthly - the Payout is paid every month. '4': Annually - the Payout is paid every year. '5': Single - the Payout is a one-off payment.
         * */
        schedule: 5,
        /**'1': Percentage - the Payout is a percentage of the current available funds for this Entity that should be paid to their Account, specified in the 'amount' field in basis points.
         * '2': Actual - the Payout is a fixed amount, specified in the 'amount' field as an integer in cents.
         * '3': Negative percentage - the Payout is a percentage of the balance, specified in the 'amount' field as a negative integer in basis points*/
        unitOfMeasure: 1,
        amount: 10000,

    },
    fee: {
        name: 'Service Fee',
        /**Valid values are: '2': The Fee is a fixed amount, specified in the 'amount' field as an integer in cents.
         * '1': The Fee is a percentage of the transaction amount, specified in the 'amount' field in basis points.
         * Note that percentage measures only make sense where the Fee schedule is set to trigger the Fee when a transaction event happens, such as an authorization, capture, or refund.
         * */
        unitOfMeasure: 1,
        amount: 2500,
        /**The schedule that determines when this Fee is triggered to be charged. Valid values are: '1': Daily - the Fee is charged every day. '2': Weekly - the Fee is charged every week. '3': Monthly - the Fee is charged every month. '4': Annually - the Fee is charged every year. '5': Single - the Fee is a one-off charge. '6': Auth - the Fee is triggered at the time of authorization of a transaction. '7': Capture - the Fee triggers at the capture time of a Transaction. '8': Refund - the Fee triggers when a refund transaction is processed. '9': Board - the Fee triggers when the Merchant is boarded. '10': Payout - the Fee triggers when a payout is processed. '11': Chargeback - the Fee triggers when a card chargeback occurs. '12': Overdraft - the Fee triggers when an overdraft usage charge from a bank is levied. '13': Interchange - the Fee triggers when interchange Fees are assessed for the Transactions of this Merchant. '14': Processor - the Fee triggers when the Transactions of this Merchant are processed by a payment processor. '15': ACH failure - the Fee triggers when an automated clearing house failure occurs. '16': Account - the Fee triggers when a bank account is verified.
         * */
        schedule: 7
    },
    account: {
        primary: 1,
        status: 0,
        currency: "USD",
    },
    txn: {
        /**
         * The transaction origin (1 = Terminal, 2 = eCommerce, 3 = Mail Order or
         * Telephone Order)
         */

        /**
         * Type of transaction (1 = Sale, 2 = Auth, 3 = Capture, 4 = Auth Reversal,
         * 5 = Refund, 6 = Reserved for future use, 7 = eCheck Sale,
         * 8 = eCheck Refund, 9 = eCheck PreSale Notification, 10 = eCheck PreRefund
         * Notification, 11 = eCheck Retry failed sale, 12 = eCheck Verification, 13 =
         * eCheck Sale/Retry Cancellation
         */
        types: {
            auth: 2,
            capture: 3,
            authReversal: 4
        },
        origin: 2
    }
};

module.exports.splashpayment = splashpayment;