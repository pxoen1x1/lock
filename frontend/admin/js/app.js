(function () {
    'use strict';

    angular.module('app', [
        'ui.router',                // Client-side Single Page Application routing framework for AngularJS.
        'ngMaterial',               // Angular Material is both a UI Component framework.
        'ngAria',                   // AngularJS module for making accessibility easy
        'ngAnimate',                // AngularJS module for animations
        'ngMessages',
        'angular-loading-bar',      // An automatic loading bar using angular interceptors
        'ngSails',                  // Module allows to use Sails.JS's awesome socket.io api with AngularJS.
    ]);
})();