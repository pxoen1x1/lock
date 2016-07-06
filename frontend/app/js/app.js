(function () {
    'use strict';

    angular.module('app', [
        'ui.router',                //Client-side Single Page Application routing framework for AngularJS.
        'ngMaterial',               //Angular Material is both a UI Component framework
        'ngSanitize',               //The ngSanitize module provides functionality to sanitize HTML.
        'angularCSS',

        'app.core',
        'app.home',
        'app.customer',
        'app.provider'
    ]);
})();
