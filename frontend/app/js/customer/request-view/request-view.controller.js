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
        'currentUserService',
        'conf'
    ];

    /* @ngInject */
    function CustomerViewRequestController($stateParams, $mdDialog, coreConstants, coreDataservice,
                                           chatSocketservice, currentRequestService, customerDataservice, currentUserService, conf) {
        var promises = {
            getRequest: null,
            getFeedback: null
        };

        var vm = this;

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
            currentUserService.getUser()
                .then(function (user) {
                    $scope.customerCardNumber = user.spCardNumber;
                });

            $scope.payWithLinked = function(){
                var merchantId = 'g1585415b362c2e';
                var amount = 1000;
                return coreDataservice.createTxn(merchantId,amount)
                        .then((res)=>{
                            $mdDialog.hide();

                            if(res.resTxn.length > 0){

                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.body))
                                        .clickOutsideToClose(true)
                                        .title('Successful payment')
                                        .ariaLabel('Alert Dialog Demo')
                                        .ok('Close')
                                );

                            }else{

                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.body))
                                        .clickOutsideToClose(true)
                                        .title('Error during payment')
                                        .ariaLabel('Please contact support')
                                        .ok('Close')
                                );
                            }
                    }); //todo: check sequrity!!!
            };

            $scope.payWithNew = function(txnData,isValid) {
                var merchantId = 'g1585415b362c2e';
                var amount = 10000;
                if(!isValid){
                    return false;
                }
                return coreDataservice.createTokenAndTxn(txnData,merchantId,amount)
                    .then((result)=> {
                        $mdDialog.hide();

                        return [result, currentUserService.getUser()];
                    })
                    .spread((result,user) => {

                    if(result.resTxn.length > 0 && result.spCardNumber){
                        vm.profileData = user;
                        vm.profileData.spCardNumber = result.spCardNumber;
                        currentUserService.setUserToLocalStorage(vm.profileData);
                        $scope.customerCardNumber = result.spCardNumber;

                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title('Successful payment')
                                .ariaLabel('Alert Dialog Demo')
                                .ok('Close')
                        );

                    }else{

                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title('Error during payment')
                                .ariaLabel('Please contact support')
                                .ok('Close')
                        );
                    }
                });
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