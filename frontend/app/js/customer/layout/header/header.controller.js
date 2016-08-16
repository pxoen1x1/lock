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

            path = path.slice(1);
            path = path.split('/');

            for (var i = 0; i < path.length; i++) {
                pathObj[i] = {
                    display: '',
                    url: ''
                };

                if (!/^\d+$/.test(path[i])) {
                    pathObj[i].display = path[i][0].toUpperCase() + path[i].slice(1);
                }

                for (var j = 0; j <= i; j++) {
                    pathObj[i].url += '/' + path[j];
                }
            }

            return pathObj;
        }

        $rootScope.$watch(function() {
            return $location.path();
        }, function() {
            try {
                vm.headerPath = createHeaderPath();
            } catch(e) {}
        });

    }
})();