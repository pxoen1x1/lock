/* global sails */
/**
 * PolicyController
 *
 * @module      :: Controller
 * @description    :: Server-side logic for managing Policy.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

const IS_BG_CHECK_ENABLED = sails.config.IS_BG_CHECK_ENABLED;
const IS_CUSTOMERS_LOCKING_ENABLED = sails.config.IS_CUSTOMERS_LOCKING_ENABLED;

let PolicyController = {
    getPolicies(req, res) {

        res.ok(
            {
                policies: {
                    isBGCheckEnabled: IS_BG_CHECK_ENABLED,
                    isCustomersLockingEnabled: IS_CUSTOMERS_LOCKING_ENABLED
                }
            }
        );
    }
};

module.exports = PolicyController;