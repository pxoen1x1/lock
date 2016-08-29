(function () {
    'use strict';

    angular
        .module('app')
        .run(runApp);

    runApp.$inject = ['$rootScope', '$state', '$mdDialog', '$mdMedia', 'cfpLoadingBar'];

    /* @ngInject */
    function runApp($rootScope, $state, $mdDialog, $mdMedia, cfpLoadingBar) {

        $rootScope.$state = $state;
        $rootScope.$mdMedia = $mdMedia;
        
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            cfpLoadingBar.start();

            if (toState.name === 'login') {
                cfpLoadingBar.complete();
                event.preventDefault();

                $mdDialog.show({
                    templateUrl: 'core/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm'
                });
            }

            if (toState.name === 'customer.invite') {
                cfpLoadingBar.complete();
                event.preventDefault();

                $mdDialog.show({
                    templateUrl: 'customer/invite/invite.html',
                    controller: 'CustomerInviteController',
                    controllerAs: 'vm'
                });
            }
        });
        $rootScope.$on('$stateChangeError', function () {
            cfpLoadingBar.complete();
        });
        $rootScope.$on('$viewContentLoaded', function () {
            cfpLoadingBar.complete();
        });
        $rootScope.$on('$stateNotFound', function () {
            cfpLoadingBar.complete();
        });
    }
})();