/**
 * Jwt
 *
 * @module      :: Model
 * @description :: Holds all distributed json web tokens
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';

let waterlock = require('waterlock');

let Jwt = {

    attributes: waterlock.models.jwt.attributes({})
};

module.exports = Jwt;
