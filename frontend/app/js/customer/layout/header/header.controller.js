(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerHeaderController', CustomerHeaderController);

    CustomerHeaderController.$inject = ['$rootScope', '$mdSidenav', '$location'];

    /* @ngInject */
    function CustomerHeaderController($rootScope, $mdSidenav, $location) {
        var vm = this;

        vm.headerPath = [];
        vm.title = '';
        vm.toggleMenu = toggleMenu;

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function createHeaderPath() {
            var path = $location.path();
            var result = [];

            if (path === '/') {

                return;
            }

            path = path.slice(1);
            path = path.split('/');

            for (var i = 0; i < path.length; i++) {
                result[i] = {
                    display: '',
                    url: ''
                };

                if (!/^\d+$/.test(path[i])) {
                    result[i].display = path[i];
                    vm.title = path[i];
                }

                result[i].url = i ? result[i-1].url : '';
                result[i].url += '/' + path[i];
            }

            return result;
        }

        $rootScope.$watch(function() {
            return $location.path();
        }, function() {

            vm.headerPath = createHeaderPath();

        });

    }
})();