(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('SpecialistRequestMapController', SpecialistRequestMapController);

    SpecialistRequestMapController.$inject = [
        '$stateParams',
        'coreConstants',
        'chatSocketservice',
        'currentRequestService',
        'conf'
    ];

    /* @ngInject */
    function SpecialistRequestMapController($stateParams, coreConstants, chatSocketservice, currentRequestService,
                                            conf) {
        var currentRequestId = $stateParams.requestId;

        var vm = this;

        vm.request = {};

        vm.baseUrl = conf.BASE_URL;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

        activate();

        function getRequest(requestId) {
            var request = {
                id: requestId
            };

            return currentRequestService.getRequest(request)
                .then(function (request) {

                    vm.request = request;

                    return vm.request;
                });
        }

        function listenRequestEvent() {
            chatSocketservice.onRequest(function (request, type) {
                if (type !== 'update' || vm.request.id !== request.id) {

                    return;
                }

                vm.request = request;
            });
        }

        function activate() {
            getRequest(currentRequestId)
                .then(function () {
                    listenRequestEvent();
                });
        }
    }
})();