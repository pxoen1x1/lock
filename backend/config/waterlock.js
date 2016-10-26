/**
 * waterlock
 *
 * defines various options used by waterlock
 * for more informaiton checkout
 *
 * http://waterlock.ninja/documentation
 */

'use strict';

module.exports.waterlock = {

    // Base URL
    //
    // used by auth methods for callback URI's using oauth and for password
    // reset links.
    baseUrl: 'http://locksmith.i-deasoft.com:1338',

    // Auth Method(s)
    //
    // this can be a single string, an object, or an array of objects for your
    // chosen auth method(s) you will need to see the individual module's README
    // file for more information on the attributes necessary. This is an example
    // of the local authentication method with password reset tokens disabled.
    authMethod: [
        {
            name: 'waterlock-local-auth',
            passwordReset: {
                tokens: false
            },
            createOnNotFound: false
        },
        {
            name: 'waterlock-facebook-auth',
            appId: '1145998722142066',
            appSecret: 'f066cefe62f69fe9cba4d117675ffc16',
            redirectUri: 'http://localhost:9000/',
            fieldMap: {
                // <model-field>: <facebook-field>,
                'firstName': 'first_name',
                'lastName': 'last_name',
                'gender': 'gender'
            }
        }
    ],

    // JSON Web Tokens
    //
    // this provides waterlock with basic information to build your tokens,
    // these tokens are used for authentication, password reset,
    // and anything else you can imagine
    jsonWebTokens: {

        // CHANGE THIS SECRET
        secret: 'aEd128AdFB40e82b',
        expiry: {
            unit: 'days',
            length: '7'
        },
        audience: 'locksmith',
        subject: 'subject',

        // tracks jwt usage if set to true
        trackUsage: false,

        // if set to false will authenticate the
        // express session object and attach the
        // user to it during the hasJsonWebToken
        // middleware
        stateless: true,

        // set the name of the jwt token property
        // in the JSON response
        tokenProperty: 'token',

        // set the name of the expires property
        // in the JSON response
        expiresProperty: 'expires',

        // configure whether or not to include
        // the user in the response - this is useful if
        // JWT is the default response for successful login
        includeUserInJwtResponse: false
    },

    // Post Actions
    //
    // Lets waterlock know how to handle different login/logout
    // attempt outcomes.
    postActions: {

        // post login event
        login: {

            // This can be any one of the following
            //
            // url - 'http://example.com'
            // relativePath - '/blog/post'
            // obj - {controller: 'blog', action: 'post'}
            // string - 'custom json response string'
            // default - 'default'
            success: 'jwt',

            // This can be any one of the following
            //
            // url - 'http://example.com'
            // relativePath - '/blog/post'
            // obj - {controller: 'blog', action: 'post'}
            // string - 'custom json response string'
            // default - 'default'
            failure: `{ "message": "User not found." }`
        },

        //post logout event
        logout: {

            // This can be any one of the following
            //
            // url - 'http://example.com'
            // relativePath - '/blog/post'
            // obj - {controller: 'blog', action: 'post'}
            // string - 'custom json response string'
            // default - 'default'
            success: 'jwt',

            // This can be any one of the following
            //
            // url - 'http://example.com'
            // relativePath - '/blog/post'
            // obj - {controller: 'blog', action: 'post'}
            // string - 'custom json response string'
            // default - 'default'
            failure: `{ "message": "You have successfully logged out." }`
        },
        // post register event
        register: {
            // This can be any one of the following
            //
            // url - 'http://example.com'
            // relativePath - '/blog/post'
            // obj - {controller: 'blog', action: 'post'}
            // string - 'custom json response string'
            // default - 'default'
            success: 'jwt',
            // This can be any one of the following
            //
            // url - 'http://example.com'
            // relativePath - '/blog/post'
            // obj - {controller: 'blog', action: 'post'}
            // string - 'custom json response string'
            // default - 'default'
            failure: 'default'
        }
    }
};
