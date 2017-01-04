(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('SendBidDialogController', SendBidDialogController);

    SendBidDialogController.$inject = [
        '$mdDialog',
        'currentRequest',
        'chatSocketservice',
        'currentUserService',
        'coreConstants'
    ];

    /* @ngInject */
    function SendBidDialogController($mdDialog, currentRequest, chatSocketservice, currentUserService, coreConstants) {
        var vm = this;

        vm.bid = {};
        vm.currentUserType = null;

        vm.userTypes = coreConstants.USER_TYPES;

        vm.createBid = createBid;
        vm.cancel = cancel;

        activate();

        function getCurrentUserType() {

            return currentUserService.getType()
                .then(function (currentUserType) {
                    vm.currentUserType = currentUserType;

                    return vm.currentUserType;
                });
        }

        function createBid(bid, isFormValid) {
            if (!isFormValid) {

                return;
            }

            bid = {
                bid: bid
            };

            return chatSocketservice.createBid(currentRequest, bid)
                .then(function (bid) {

                    $mdDialog.hide(bid);
                });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function activate() {
            getCurrentUserType();
        }
    }
})();