/**
 * Created by yury on 12/29/16.
 */
(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('PaymentDialogController', PaymentDialogController);

    PaymentDialogController.$inject = [
        'currentUserService',
        'coreDataservice',
        '$mdDialog',
        'offer',
        'currentRequest'
    ];

    /* @ngInject */
    function PaymentDialogController(currentUserService, coreDataservice, $mdDialog, offer, currentRequest) {

        var vm = this;

        vm.txnData = {};
        vm.selectPayWithNew = null;
        vm.payWithLinked = payWithLinked;
        vm.payWithNew = payWithNew;
        vm.cancel = cancel;

        activate();

        function getCurrentUser() {

            return currentUserService.getUser()
                .then(function (user) {
                    vm.customerCardNumber = user.spCardNumber;

                    if(!vm.customerCardNumber){
                        vm.selectPayWithNew = true;
                    }

                    return vm.customerCardNumber;
                });
        }

        function payWithLinked() {
            var specialist;

            return coreDataservice.getUser(offer.executor.id)
                .then(function(response) {
                    specialist = response.data.user;

                    return coreDataservice.getSpecialistsGroupAdmin(specialist.id);
                })
                .then(function (admin) {
                    if(admin){
                        return coreDataservice.createAuthTxn(admin.spMerchantId, offer.cost, currentRequest.id);
                    }

                   return coreDataservice.createAuthTxn(specialist.spMerchantId, offer.cost, currentRequest.id);
                })
                .then(function (res) {
                    $mdDialog.hide({result: true});

                    if (res.resTxn.length > 0) {

                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Successful payment')
                                .ok('Close')
                        );
                    } else {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error during payment')
                                .textContent('Please contact support')
                                .ok('Close')
                        );
                    }
                }); //todo: check sequrity!!!
        }

        function payWithNew(txnData, isValid) {

            if (!isValid) {

                return false;
            }

            var tokenAndTxnResult;
            var specialist;

            return coreDataservice.getUser(offer.executor.id)
                .then(function(response) {
                    specialist = response.data.user;

                    return coreDataservice.getSpecialistsGroupAdmin(specialist.id);
                })
                .then(function (admin) {
                    if(admin) {

                        return coreDataservice.createTokenAndAuthTxn(txnData, admin.spMerchantId, offer.cost, currentRequest.id);
                    }

                    return coreDataservice.createTokenAndAuthTxn(txnData, specialist.spMerchantId, offer.cost, currentRequest.id);
                })
                .then(function (result) {
                    tokenAndTxnResult = result; //todo: redo with spread

                    return currentUserService.getUser();
                })
                .then(function (user) {

                    if (tokenAndTxnResult.resTxn.length > 0 && tokenAndTxnResult.spCardNumber) {
                        vm.profileData = user;
                        vm.profileData.spCardNumber = tokenAndTxnResult.spCardNumber;
                        currentUserService.setUserToLocalStorage(vm.profileData);
                        vm.customerCardNumber = tokenAndTxnResult.spCardNumber;

                        $mdDialog.hide({result: true});

                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Successful payment')
                                .ok('Close')
                        );
                    } else {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Error during payment')
                                .textContent('Please contact support')
                                .ok('Close')
                        );
                    }
                });
        }

        function cancel() {
            $mdDialog.cancel();
        }


        function activate() {
            getCurrentUser();
        }
    }

})();

