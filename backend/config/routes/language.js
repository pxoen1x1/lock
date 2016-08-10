'use strict';

let languageRoutes ={
    'GET /api/lists/languages': {
        controller: 'LanguageController',
        action: 'getLanguages'
    }
};

module.exports.routes = languageRoutes;