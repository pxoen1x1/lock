(function () {
    'use strict';

    angular
        .module('app.registration')
        .config(configureState);

    configureState.$inject = ['$stateProvider'];

    /* @ngInject */
    function configureState($stateProvider) {
        $stateProvider
            .state('registration', {
                parent: 'root',
                abstract: true,
                views: {
                    'content@root': {
                        templateUrl: 'registration/layout/layout.html'
                    },
                    'header@registration': {
                        templateUrl: 'registration/layout/header/header.html',
                        controller: 'RegistrationHeaderController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('registration.provider', {
                url: '/provider/registration',
                views: {
                    'content@registration': {
                        templateUrl: 'registration/specialist/registration.html',
                        controller: 'SpecialistRegistrationController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();