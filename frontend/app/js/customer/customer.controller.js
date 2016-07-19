(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerLayoutController', CustomerLayoutController);

    CustomerLayoutController.$inject = ['$mdMedia', '$rootScope', '$state', '$mdSidenav', '$location', 'menuItems'];

    /* @ngInject */
    function CustomerLayoutController($mdMedia, $rootScope, $state, $mdSidenav, $location, menuItems) {
        var vm = this;
        vm.toggleMenu = toggleMenu;
        vm.$mdMedia = $mdMedia;
        vm.menuItems = menuItems;
        vm.tabsFlow = initTabsFlow(menuItems);

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if (toState.name == 'customer.request') {
                    event.preventDefault();
                    $state.go('customer.history');
                    return;
                }

                var elem = angular.element(document.getElementsByClassName('content'));

                if (vm.tabsFlow.indexOf(fromState.name) > vm.tabsFlow.indexOf(toState.name)) {
                    elem.addClass('anim-slide-left');
                    elem.removeClass('anim-slide-right');
                } else {
                    elem.addClass('anim-slide-right');
                    elem.removeClass('anim-slide-left');
                }
            }
        );

        $rootScope.$watch(function() {
            return $location.path();
        }, function(){
            vm.path = $location.path();
            vm.headerPath = headerPath();
        });

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        function initTabsFlow(a) {
            var arr = [];
            for (var i=0; i<a.length; i++) {
                arr.push(a[i].name);
            }
            return arr;
        }

        function headerPath() {
            var path = $location.path();
            var pathObj = [];
            path = path.slice(1);
            path = path.split('/');
            for (var i = 0; i < path.length; i++) {
                pathObj[i] = {display: '', url: ''};
                if (!/^\d+$/.test(path[i])) {
                    pathObj[i].display = path[i][0].toUpperCase() + path[i].slice(1);
                }
                for (var j = 0; j <= i; j++) {
                    pathObj[i].url += '/' + path[j];
                }
            }
            return pathObj;
        }

    }
})();
