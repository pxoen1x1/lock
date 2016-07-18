(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerLayoutController', CustomerLayoutController);

    CustomerLayoutController.$inject = ['$mdMedia', '$rootScope', '$state', '$mdSidenav', '$location'];

    /* @ngInject */
    function CustomerLayoutController($mdMedia, $rootScope, $state, $mdSidenav, $location) {
        var vm = this;
        vm.toggleMenu = toggleMenu;
        vm.$mdMedia = $mdMedia;
        vm.headerPath = headerPath();
        vm.path = $location.path();

        vm.menuNavigationItems = [
            {
                display: 'New request',
                min: 'New',
                icon: 'playlist_add',
                href: '/client/request'
            },
            {
                display: 'History',
                min: 'History',
                icon: 'history',
                href: '/client/history'
            },
            {
                display: 'Map',
                min: 'Map',
                icon: 'map',
                href: '/client/map'
            },
            {
                display: 'Chat',
                min: 'Chat',
                icon: 'chat',
                href: '/client/chat'
            },
            {
                display: 'Recommended',
                min: 'Top',
                icon: 'star',
                href: '/client/recommended'
            },
            {
                display: 'Settings',
                min: 'Settings',
                icon: 'settings',
                href: '/client/settings'
            }
        ];

        vm.tabFlow = ['/request', '/history', '/map', '/chat', '/recommended', '/settings'];

        function toggleMenu() {
            $mdSidenav('left').toggle();
        }

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                var elem = angular.element(document.getElementsByClassName('content'));

                if (vm.tabFlow.indexOf(fromState.url) > vm.tabFlow.indexOf(toState.url)) {
                    elem.addClass('anim-slide-left');
                    elem.removeClass('anim-slide-right');
                } else {
                    elem.addClass('anim-slide-right');
                    elem.removeClass('anim-slide-left');
                }

                vm.headerPath = headerPath();
                vm.path = $location.path();
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
