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
        vm.toggleMenu = toggleMenu;

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function createHeaderPath() {
            var path = $location.path();
            var pathObj = [];

            if (path === '/') {

                return;
            }

            path = path.slice(1);
            path = path.split('/');

            for (var i = 0; i < path.length; i++) {
                pathObj[i] = {
                    display: '',
                    url: ''
                };

                if (!/^\d+$/.test(path[i])) {
                    pathObj[i].display = path[i];
                }

                pathObj[i].url = i > 0 ? pathObj[i-1].url + '/' + path[i] : '/' + path[i];
            }

            return pathObj;
        }

        $rootScope.$watch(function() {
            return $location.path();
        }, function() {

            vm.headerPath = createHeaderPath();

        });

    }
})();