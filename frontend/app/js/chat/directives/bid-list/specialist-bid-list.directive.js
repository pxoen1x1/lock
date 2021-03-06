(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('specialistBidList', specialistBidList);

    function specialistBidList() {
        var directive = {
            bindToController: true,
            controller: SpecialistBidListController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                bids: '=',
                currentBid: '=',
                currentRequest: '=',
                selectedTab: '=',
                chatSearch: '=?',
                changeCurrentRequest: '&'
            },
            replace: true,
            templateUrl: 'chat/directives/bid-list/specialist-bid-list.html'
        };

        return directive;
    }

    SpecialistBidListController.$inject = [
        '$scope',
        '$mdMedia',
        '$mdSidenav',
        'conf',
        'coreConstants',
        'chatSocketservice',
        'mobileService'
    ];

    /* @ngInject */
    function SpecialistBidListController($scope, $mdMedia, $mdSidenav, conf, coreConstants, chatSocketservice,
                                         mobileService) {
        var bidHandler;
        var vm = this;

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

        vm.changeCurrentBid = changeCurrentBid;

        activate();

        function getBids() {

            return chatSocketservice.getSpecialistBids()
                .then(function (bids) {
                    vm.bids = bids;

                    return vm.bids;
                });
        }

        function listenBidEvent() {
            bidHandler = chatSocketservice.onBid(function (bid, type) {
                if (type === 'create') {

                    vm.bids.unshift(bid);
                }


                if (type === 'delete') {
                    vm.currentBid = null;

                    vm.bids = vm.bids.filter(function (item) {

                        return item.id !== bid.id;
                    });

                    if (vm.bids.length === 0) {
                        vm.selectedTab = 'chats';
                    }
                }
            });
        }

        function changeCurrentBid(currentBid) {
            if (currentBid === null) {
                vm.currentBid = null;

                return;
            }

            if (vm.currentBid && vm.currentBid.id === currentBid.id) {

                return;
            }

            vm.currentBid = currentBid;

            vm.changeCurrentRequest({request: currentBid.request});

            if (!$mdMedia('gt-md')) {
                $mdSidenav('left-sidenav').close();
            }
        }

        function activate() {
            getBids()
                .then(listenBidEvent);

            $scope.$on('$destroy', function () {
                chatSocketservice.offBid(bidHandler);
            });
        }
    }
})();