/**
 * Attempt
 *
 * @module      :: Model
 * @description :: Tracks login attempts of users on your app.
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let waterlock= require('waterlock');

let Attempt = {

    attributes: waterlock.models.attempt.attributes({})
};

module.exports = Attempt;