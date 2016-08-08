(function () {
    'use strict';

    angular.module('app', [
        'ui.router',                // Client-side Single Page Application routing framework for AngularJS.
        'ngMaterial',               // Angular Material is both a UI Component framework.
        'ngSanitize',               // The ngSanitize module provides functionality to sanitize HTML.
        'ngMessages',
        'angularMoment',            // AngularJS directive and filters for Moment.JS.
        'angular-loading-bar',
        'md.data.table',
        'ngAnimate',
        'anim-in-out',
        'ui.utils.masks',           // Opinionated angular input masks.
        'uiGmapgoogle-maps',
        'checklist-model',          // AngularJS directive for list of checkboxes.
        'mdPickers',                // Material Design date/time pickers built with Angular Material and Moment.js.

        'app.core',
        'app.home',
        'app.customer',
        'app.provider'
    ]);
})();
