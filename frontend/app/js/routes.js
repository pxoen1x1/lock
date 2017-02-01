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
                    }
                }
            })
            .state('login', {
                reloadOnSearch: false
            });

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');

            $state.go('home.main');
        });
    }
})();