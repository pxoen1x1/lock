(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerRequestController', CustomerRequestController);

    CustomerRequestController.$inject = ['$rootScope', '$state', '$location'];

    /* @ngInject */
    function CustomerRequestController($rootScope, $state, $location) {
        var vm = this;

        vm.requestId = $state.params.requestId;
        vm.tabBarItems = [
            {
                display: 'Request',
                icon: 'list',
                href: '/client/request/' + vm.requestId,
                name: 'customer.request.new'
            },
            {
                display: 'Map',
                icon: 'location_on',
                href: '/client/request/' + vm.requestId + '/map',
                name: 'customer.request.map'
            },
            {
                display: 'Chat',
                icon: 'chat',
                href: '/client/request/' + vm.requestId + '/chat',
                name: 'customer.request.chat'
            },
            {
                display: 'Recommended',
                icon: 'star',
                href: '/client/request/' + vm.requestId + '/recommended',
                name: 'customer.request.recommended'
            }
        ];
        vm.tabsFlow = initTabsFlow(vm.tabBarItems);
        
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                vm.requestId = toParams.requestId ? toParams.requestId : fromParams.requestId;

                var elem = angular.element(document.getElementsByClassName('content'));
                if (vm.tabsFlow.indexOf(fromState.name) < vm.tabsFlow.indexOf(toState.name)) {
                    elem.addClass('anim-slide-left');
                    elem.removeClass('anim-slide-right');
                } else {
                    elem.addClass('anim-slide-right');
                    elem.removeClass('anim-slide-left');
                }
            }
        );

        function initTabsFlow(a) {
            var arr = [];
            for (var i = 0; i < a.length; i++) {
                arr.push(a[i].name);
            }
            return arr;
        }

    }
})();
