/**
 * Use
 *
 * @module      :: Model
 * @description :: Tracks the usage of a given Jwt
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let waterlock = require('waterlock');

let Use = {

    attributes: waterlock.models.use.attributes({})
};

module.exports = Use;
