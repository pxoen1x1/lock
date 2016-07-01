(function () {
    'use strict';

    angular
        .module('app')
        .config(configureState);

    configureState.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configureState($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('root', {
                url: '',
                abstract: true,
                views: {
                    '@': {
                        templateUrl: 'layout/layout.html'
                    },
                    'header@root': {
                        templateUrl: 'layout/header.html'
                    },
                    'menu@root': {
                        templateUrl: 'layout/menu.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/requests');
    }
})();