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
            });

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            var $mobileService = $injector.get('$mobileService');

            if ($mobileService.isMobileApplication()) {
                $state.go('login');
            }
            $state.go('home.main');
        });
    }
})();