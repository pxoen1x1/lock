/**
 * ResetToken
 *
 * @module      :: Model
 * @description :: Describes a users reset token
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let waterlock = require('waterlock');

let ResetToken = {

    attributes: waterlock.models.resetToken.attributes({}),

    beforeCreate: waterlock.models.resetToken.beforeCreate,
    afterCreate: waterlock.models.resetToken.afterCreate
};

module.exports = ResetToken;
