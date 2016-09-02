/* global waterlock, Jwt */

/**
 * JwtService
 */

'use strict';

let JwtService = {
    create(jwtData, user) {
        return Jwt.create({token: jwtData.token, uses: 0, owner: user.id})
            .then(
                () => {
                    let result = {};

                    result[waterlock.config.jsonWebTokens.tokenProperty] = jwtData.token;
                    result[waterlock.config.jsonWebTokens.expiresProperty] = jwtData.expires;

                    if (waterlock.config.jsonWebTokens.includeUserInJwtResponse) {
                        result.user = user;
                    }

                    return result;
                });
    }
};

module.exports = JwtService;

