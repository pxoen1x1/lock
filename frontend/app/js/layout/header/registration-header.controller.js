(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('RegistrationHeaderController', RegistrationHeaderController);

    RegistrationHeaderController.$inject = ['$rootScope', '$state', 'authService'];

    /* @ngInject */
    function RegistrationHeaderController($rootScope, $state, authService) {
        var vm = this;

        vm.pageTitles = [];

        vm.isAuthenticated = authService.isAuthenticated;
        vm.logout = authService.logout;

        activate();

        $rootScope.$on('$stateChangeStart', function (fromState, toState, fromParams, toParams) {
            vm.pageTitles = createPageTitles(toState);
        });

        function createPageTitles(state) {
            var pageTitles = [];

            if (!state.parent) {
                return vm.pageTitles;
            }
            
            while (state.parent) {
                if (state.data && state.data.title) {
                    pageTitles.unshift({
                        'title': state.data.title,
                        'url': $state.href(state.name)
                    });
                }
                state = $state.get(state.parent);
            }

            return pageTitles;
        }

        function activate() {
            vm.pageTitles = createPageTitles($state.current);
        }

    }
})();