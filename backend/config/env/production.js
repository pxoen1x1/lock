/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the production        *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    connections: {
        productionMysqlServer: {
            adapter: 'sails-mysql',
            host: 'lockhealdb.c6qxt1uj9j0m.us-east-1.rds.amazonaws.com',
            user: 'lockheal',
            password: 'l0ck$m1th_p@$$',
            database: 'lockheal',
            charset: 'utf8',
            collation: 'utf8_general_ci'
        }
    },

    models: {
        connection: 'productionMysqlServer',
        migrate: 'save'
    },

    /***************************************************************************
     * Set the port in the production environment to 80                        *
     ***************************************************************************/

    // port: 80,

    /***************************************************************************
     * Set the log level in production environment to "silent"                 *
     ***************************************************************************/

    // log: {
    //   level: "silent"
    // }

    baseUrl: 'https://lockheal.com',
    homePage: 'https://lockheal.com',
    EmailConfirmedUrl: '/?emailConfirmed'
};
