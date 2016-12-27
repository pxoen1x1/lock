(function () {
    'use strict';

    angular
        .module('app.chat')
        .directive('messageBid', messageBid);

    function messageBid() {
        var directive = {
            bindToController: true,
            controller: MessageBidController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                chats: '=',
                bids: '=',
                currentUser: '=',
                currentBid: '=',
                currentChat: '=',
                currentRequest: '=',
                selectedTab: '=',
                acceptOffer: '&'
            },
            replace: true,
            templateUrl: 'chat/directives/message-bid/message-bid.html'
        };

        return directive;
    }

    MessageBidController.$inject = ['$scope', 'chatSocketservice', 'coreConstants', 'chatConstants', '$mdDialog', 'currentUserService', 'coreDataservice'];

    /* @ngInject */
    function MessageBidController($scope, chatSocketservice, coreConstants, chatConstants, $mdDialog, currentUserService, coreDataservice) {
        var vm = this;

        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.requestStatus = coreConstants.REQUEST_STATUSES;
        vm.userType = coreConstants.USER_TYPES;
        vm.messageType = chatConstants.MESSAGE_TYPES;

        vm.startChat = startChat;
        vm.acceptBid = acceptBid;
        vm.declineBid = declineBid;
        vm.showPaymentModal = showPaymentModal;

        function createChat(bid) {
            var request = bid.request;
            var member = {
                member: bid.specialist
            };

            return chatSocketservice.createChat(request, member)
                .then(function (createdChat) {

                    return createdChat;
                });
        }

        function deleteBid(bid) {

            return chatSocketservice.deleteBid(bid)
                .then(function (bid) {

                    return bid;
                });
        }

        function startChat(currentBid, currentRequest) {
            if (currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            return createChat(currentBid)
                .then(function (createdChat) {

                    return deleteBid(currentBid)
                        .then(function (deletedBid) {
                            vm.bids = vm.bids.filter(function (bid) {

                                return bid.id !== deletedBid.id;
                            });

                            vm.chats.unshift(createdChat);

                            vm.currentBid = null;
                            vm.currentChat = createdChat;
                            vm.selectedTab = 'chats';
                        });
                });
        }

        function acceptBid(currentBid, currentRequest) {
            if (currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            var offer = {
                cost: currentBid.cost,
                executor: currentBid.specialist
            };

            var message = {
                message: currentBid.message,
                cost: currentBid.cost,
                type: vm.messageType.AGREEMENT
            };

            return startChat(currentBid, currentRequest)
                .then(function () {

                    return $scope.$applyAsync(function () {

                        return vm.acceptOffer({offer: offer, message: message});
                    });
                });
        }

        function declineBid(currentBid, currentRequest) {
            if (currentRequest.status !== vm.requestStatus.NEW) {

                return;
            }

            return chatSocketservice.declineBid(currentBid)
                .then(function (updatedBid) {
                    vm.bids = vm.bids.filter(function (bid) {

                        return bid.id !== updatedBid.id;
                    });

                    vm.currentBid = null;
                    vm.selectedTab = vm.bids.length > 0 ? vm.selectedTab : 'chats';
                });
        }


        function PaymentDialogController($scope, $mdDialog) {

            $scope.txnData = {};
            $scope.selectPayWithNew = null;
            currentUserService.getUser()
                .then(function (user) {
                    $scope.customerCardNumber = user.spCardNumber;
                });

            $scope.Pay = function(){

              if($scope.selectPayWithNew){
                  $scope.payWithNew($scope.txnData); // todo: how to send txnForm.$valid here
              }else{
                  $scope.payWithLinked();
              }
            };

            $scope.payWithLinked = function(){

                return coreDataservice.getUser(vm.currentBid.specialist.id)
                    .then(function(response) {

                        var specialist = response.data.user;
                        return coreDataservice.createAuthTxn(specialist.spMerchantId, vm.currentBid.cost, vm.currentRequest.id)
                    })
                    .then((res)=>{
                        $mdDialog.hide();

                        if(res.resTxn.length > 0){

                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Successful payment')
                                    .ariaLabel('Successful payment')
                                    .ok('Close')
                            );

                            vm.acceptBid(vm.currentBid, vm.currentRequest); // todo: uncomment
                        }else{

                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Error during payment')
                                    .ariaLabel('Please contact support')
                                    .ok('Close')
                            );
                        }
                    }); //todo: check sequrity!!!
            };

            $scope.payWithNew = function(txnData) { // ,isValid

                /*if(!isValid){
                    return false;
                }*/

                var tokenAndTxnResult;

                return coreDataservice.getUser(vm.currentBid.specialist.id)
                    .then(function(response) {
                        var specialist = response.data.user;

                        return coreDataservice.createTokenAndAuthTxn(txnData,specialist.spMerchantId,vm.currentBid.cost)
                    })
                    .then((result)=> {
                        tokenAndTxnResult = result; //todo: redo with spread

                        return currentUserService.getUser();
                    })
                    .then((user) => {

                        if(tokenAndTxnResult.resTxn.length > 0 && tokenAndTxnResult.spCardNumber){
                            vm.profileData = user;
                            vm.profileData.spCardNumber = tokenAndTxnResult.spCardNumber;
                            currentUserService.setUserToLocalStorage(vm.profileData);
                            $scope.customerCardNumber = tokenAndTxnResult.spCardNumber;

                            $mdDialog.hide();
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Successful payment')
                                    .ariaLabel('Successful payment')
                                    .ok('Close')
                            );

                            vm.acceptBid(vm.currentBid, vm.currentRequest) // todo: uncomment

                        }else{

                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Error during payment')
                                    .ariaLabel('Please contact support')
                                    .ok('Close')
                            );
                        }
                    });
            };

            $scope.cancel = function(){
                $mdDialog.cancel();
            }
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

    }
})();