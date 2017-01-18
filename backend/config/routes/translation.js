'use strict';

let translationRoutes = {
    'GET /api/translations/:langKey': {
        controller: 'TranslationController',
        action: 'getTranslation'
    }
};

module.exports.routes = translationRoutes;