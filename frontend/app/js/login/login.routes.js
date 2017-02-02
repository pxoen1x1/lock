(function () {
    'use strict';

    angular
        .module('app.login')
        .config(configureState);

    configureState.$inject = ['$stateProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('loginMobile', {
                parent: 'root',
                abstract: true,
                views: {
                    'content@root': {
                        templateUrl: 'login/layout/layout.html'
                    },
                    'header@loginMobile': {
                        templateUrl: 'login/layout/header/header.html'
                    }
                }
            })
            .state('loginMobile.login', {
                url: '/loginMobile',
                views: {
                    'content@loginMobile': {
                        templateUrl: 'login/login.html',
                        controller: 'MobileLoginController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();