(function () {
    'use strict';

    angular
        .module('app.customer')
        .config(configureState);

    configureState.$inject = ['$stateProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('customer', {
                parent: 'root',
                abstract: true
            })
            .state('customer.requests', {
                url: '/requests',
                views: {
                    'content@root': {
                        templateUrl: 'customer/requests/requests.html',
                        controller: 'RequestsController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();