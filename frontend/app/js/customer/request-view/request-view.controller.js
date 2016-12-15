(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerViewRequestController', CustomerViewRequestController);

    CustomerViewRequestController.$inject = [
        '$stateParams',
        '$mdDialog',
        'coreConstants',
        'coreDataservice',
        'chatSocketservice',
        'currentRequestService',
        'customerDataservice',
        'splashPaymentService',
        'conf'
    ];

    /* @ngInject */
    function CustomerViewRequestController($stateParams, $mdDialog, coreConstants, coreDataservice,
                                           chatSocketservice, currentRequestService, customerDataservice, splashPaymentService, conf) {
        var promises = {
            getRequest: null,
            getFeedback: null
        };

        var vm = this;

        vm.request = {};
        vm.feedback = {};

        vm.currentRequestId = $stateParams.requestId;

        vm.mapOptions = {
            zoom: 14,
            scrollwheel: false,
            streetViewControl: false,
            disableDefaultUI: true,
            draggable: false,
            zoomControl: false,
            disableDoubleClickZoom: true
        };

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.closeRequest = closeRequest;
        vm.setRequestStatusAsDone = setRequestStatusAsDone;
        vm.addFeedback = addFeedback;
        vm.showPaymentModal = showPaymentModal;

        activate();

        function getRequestById(request) {
            if (promises.getRequest) {
                promises.getRequest.cancel();
            }

            var userType = 'client';

            promises.getRequest = coreDataservice.getRequest(userType, request);

            return promises.getRequest
                .then(function (response) {

                    return response.data.request;
                });
        }

        function getRequest() {
            var currentRequest = {
                id: vm.currentRequestId
            };

            return getRequestById(currentRequest)
                .then(function (request) {
                    vm.request = request;
                    currentRequestService.setRequest(vm.request);

                    return vm.request;
                });
        }

        function getFeedback() {

            return getRequestFeedback(vm.currentRequestId)
                .then(function (feedback) {
                    vm.feedback = feedback;

                    return vm.feedback;
                });
        }

        function getRequestFeedback(requestId) {
            if (promises.getFeedback) {
                promises.getFeedback.cancel();
            }

            promises.getFeedback = customerDataservice.getRequestFeedback(requestId);

            return promises.getFeedback
                .then(function (response) {

                    return response.data.feedback;
                });
        }

        function changeRequestStatus(request, status) {

            return coreDataservice.updateRequestStatus(request, status)
                .then(function (updatedRequest) {

                    return updatedRequest;
                });
        }

        function listenRequestEvent() {
            chatSocketservice.onRequest(function (request, type) {
                if (type !== 'update' || vm.request.id !== request.id) {

                    return;
                }

                vm.request = request;
                currentRequestService.setRequest(vm.request);
            });
        }

        function closeRequest(request) {
            if (!request || vm.request.status !== vm.requestStatus.NEW) {

                return;
            }

            var status = {
                status: coreConstants.REQUEST_STATUSES.CLOSED
            };

            return changeRequestStatus(request, status)
                .then(function (request) {
                    vm.request = request;
                    currentRequestService.setRequest(vm.request);

                    return vm.request;
                });
        }

        function setRequestStatusAsDone(request) {
            if (!request || vm.request.status !== vm.requestStatus.DONE) {

                return;
            }

            var status = {
                status: coreConstants.REQUEST_STATUSES.CLOSED
            };

            return changeRequestStatus(request, status)
                .then(function (request) {
                    vm.request = request;
                    currentRequestService.setRequest(vm.request);

                    return vm.request;
                });
        }

        function addFeedback(request) {
            event.preventDefault();

            $mdDialog.show({
                templateUrl: 'customer/feedback/feedback.html',
                controller: 'CustomerFeedbackController',
                controllerAs: 'vm',
                locals: {
                    requestInfo: request
                }
            })
                .then(function () {
                    getFeedback();
                });
        }


        function PaymentDialogController($scope, $mdDialog) {

            $scope.createAuthTxn = function(txnData,isValid) {
                if(!isValid){
                    return false;
                }
                console.log(txnData);
                return splashPaymentService.createAuthTxn(txnData);
                $mdDialog.hide();
            };
        }

        function showPaymentModal(ev) {
            $mdDialog.show({
                    controller: PaymentDialogController,
                    templateUrl: 'customer/request-view/payment-modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                //    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                });/*
                .then(function(answer) {
                    console.log(answer);
                    var status = 'You said the information was "' + answer + '".';
                }, function() {
                    var status = 'You cancelled the dialog.';
                });*/
        };

        function activate() {
            getRequest()
                .then(getFeedback)
                .then(listenRequestEvent);
        }
    }
})();