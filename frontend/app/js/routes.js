(function () {
    'use strict';

    angular
        .moulde('app')
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
                        templateUrl: ''
                    },
                    'header@root': {
                        templateUrl: ''
                    },
                    'menu@root': {
                        templateUrl: ''
                    },
                    'footer@root': {
                        templateUrl: ''
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    }
})();