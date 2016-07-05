(function () {
    'use strict';

    angular.module('app', [
        'ui.router',                //Client-side Single Page Application routing framework for AngularJS.
        'ngMaterial',               //Angular Material is both a UI Component framework
        'ngSanitize',               //The ngSanitize module provides functionality to sanitize HTML.

        'app.core',
        'app.customer'
    ]);
})();