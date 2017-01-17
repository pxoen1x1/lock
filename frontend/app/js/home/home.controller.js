(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$state'];

    /* @ngInject */
    function HomeController($state) {
        var vm = this;
        vm.toggleMenu = toggleMenu;
        vm.dataArray = [
            {
                txt: 'asda sdas das dasd'
            },
            {
                txt: 'qweq weqweqweqwe qwe '
            },
            {
                txt: 'zczxcz zc z cz czxczxcz  zc z'
            }
        ];

        activate();


        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function activate() {
        }
    }
})();