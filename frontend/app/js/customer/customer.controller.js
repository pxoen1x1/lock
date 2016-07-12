(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerLayoutController', CustomerLayoutController);

    CustomerLayoutController.$inject = ['$rootScope', '$state', '$mdSidenav', '$location'];

    /* @ngInject */
    function CustomerLayoutController($rootScope, $state, $mdSidenav, $location) {
        var vm = this;
        vm.toggleMenu = toggleMenu;
        vm.headerPath = headerPath();

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                vm.headerPath = headerPath();
            }
        );

        function headerPath() {
            var path = $location.path();
            var pathObj = [];
            path = path.slice(1);
            path = path.split('/');
            for (var i = 0; i < path.length; i++) {
                pathObj[i] = {display: '', url: ''};
                pathObj[i].display = path[i][0].toUpperCase() + path[i].slice(1);
                for (var j = 0; j <= i; j++) {
                    pathObj[i].url += '/' + path[j];
                }
            }
            return pathObj;
        }

    }
})();
