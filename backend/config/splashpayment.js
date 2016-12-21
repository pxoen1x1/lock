'use strict';

let splashpayment = {
    bankAccountTypes: [
        {code: 8, name: 'Checking account TEST'},
        {code: 9, name: 'Savings account'},
        {code: 10, name: 'Corporate checking account'},
        {code: 11, name: 'Corporate savings account'}
    ],
    merchant: {
        member: {
            dob: '19750101',
            title: 'Director',
            ownership: 10000
        },
        new: 0,
        annualCCSales: '500000',
        status: 1,
        mcc: '1750',
        country: 'USA',
        /**
         * Company type (+0 = Sole Proprietorship, 1 = Corporation, 2 = LLC,
         * 3 = Partnership, +4 = Association, 5 = Non Profit, 6 = Governmental)
         */
        type: 1
    }
};

module.exports.splashpayment = splashpayment;