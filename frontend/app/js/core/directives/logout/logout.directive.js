(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('logout', logout);

    logout.$inject = ['$state', 'authService'];

    /* @ngInject */
    function logout($state, authService) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: true
        };
        return directive;

        function link(scope, element) {
            element.on('click', function () {

                authService.logout()
                    .then(function () {

                        $state.go('login');
                    });
            });
        }
    }
})();