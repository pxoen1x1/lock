(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerViewRequestController', CustomerViewRequestController);

    CustomerViewRequestController.$inject = [
        '$q',
        '$stateParams',
        '$mdDialog',
        'coreConstants',
        'coreDataservice',
        'chatSocketservice',
        'currentRequestService',
        'customerDataservice',
        'conf',
        '$translate'
    ];

    /* @ngInject */
    function CustomerViewRequestController($q, $stateParams, $mdDialog, coreConstants, coreDataservice,
                                           chatSocketservice, currentRequestService, customerDataservice, conf, $translate) {
        var promises = {
            getRequest: null,
            getFeedback: null
        };

        var vm = this;
        var dialog = {
            title: 'ERROR_DURING_CANCELLING_PAYMENT',
            textContent: 'PLEASE_CONTACT_SUPPORT',
            ok: 'CLOSE'
        };

        vm.request = {};
        vm.feedback = {};
        vm.profileData = {};

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
        vm.cancelRequest = cancelRequest;
        vm.setRequestStatusAsDone = setRequestStatusAsDone;
        vm.addFeedback = addFeedback;

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

        function cancelRequest(request) {
            if (!request || vm.request.status !== vm.requestStatus.IN_PROGRESS) {

                return;
            }

            return coreDataservice.reverseAuthTxn(request.id)
                .then(function (response) {
                    if (response.result !== true) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title(dialog.title)
                                .textContent(dialog.textContent)
                                .ok(dialog.ok)
                        );

                        return $q.reject('');
                    }

                    var status = {
                        status: coreConstants.REQUEST_STATUSES.NEW
                    };

                    return changeRequestStatus(request, status);
                })
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

            return coreDataservice.createCaptureTxn(request.id)
                .then(function (res) {
                    if (res.resTxn.length === 0) {

                        return $q.reject();
                    }

                    var status = {
                        status: coreConstants.REQUEST_STATUSES.CLOSED
                    };

                    return changeRequestStatus(request, status);
                })
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

        function getDialogTranslation() {
            $translate('ERROR_DURING_CANCELLING_PAYMENT')
                .then(function(translation) {
                    dialog.title = translation;
                });
            $translate('PLEASE_CONTACT_SUPPORT')
                .then(function(translation) {
                    dialog.textContent = translation;
                });
            $translate('CLOSE')
                .then(function(translation) {
                    dialog.ok = translation;
                });
        }

        function activate() {
            getRequest()
                .then(getFeedback)
                .then(listenRequestEvent)
                .then(getDialogTranslation);
        }
    }
})();