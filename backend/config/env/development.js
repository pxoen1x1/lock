/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    connections: {
        developmentMysqlServer: {
            adapter: 'sails-mysql',
            host: 'lockhealdb.c6qxt1uj9j0m.us-east-1.rds.amazonaws.com',
            user: 'lockheal',
            password: '10ckhe@1',
            database: 'lockleah',
            charset: 'utf8',
            collation: 'utf8_general_ci'
        }
    },

    models: {
        connection: 'developmentMysqlServer',
        migrate: 'alter'
    },

    hookTimeout: 120000,

    port: 1337,
    baseUrl: 'https://lockheal.com',
    homePage: 'https://lockheal.com'
};
