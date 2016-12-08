(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = ['currentUserService', 'coreConstants', 'conf'];

    /* @ngInject */
    function ProviderProfileController(currentUserService, coreConstants, conf) {
        var vm = this;

        vm.profileData = {};

        vm.datePickerOptions = {
            maxDate: new Date()
        };

        vm.isEditing = false;
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';
        
        vm.updateUser = updateUser;
        vm.setUserPayment = setUserPayment;
        vm.getUser = getUser;
        vm.updateMerchant = updateMerchant;

        activate();

        function updateUser(user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            if (vm.newPortrait) {
                user.portrait = {
                    base64: vm.newPortrait
                };
            }

            return currentUserService.setUser(user)
                .then(function (user) {

                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';
                    vm.newPortrait = '';
                    vm.isEditing = false;

                    return vm.profileData;
                });
        }

        function setUserPayment(userPayment, isFormValid) {
            if (!isFormValid) {

                return;
            }

            return currentUserService.setUserPayment(userPayment)
                .then(function (userPayment) {
                    //vm.profileData.paymentData = [];
                    vm.profileData.paymentData = userPayment.userPayment;
                    vm.isEditingPayment = false;
                    console.log(vm.profileData.paymentData);
                    console.log('--2-');
                    return vm.profileData;
/*                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';
                    vm.newPortrait = '';
                    vm.isEditing = false;

                    return vm.profileData;*/
                });
        }

        function updateMerchant(merchantData, isFormValid) {
            if (!isFormValid) {
                return;
            }

            return currentUserService.updateMerchant(merchantData)
                .then(function (merchant) {
                    vm.profileData.merchantData = merchant.merchantEntity[0];;
                    vm.isEditingMerchant = false;
                    console.log(vm.profileData.merchantData);
                    console.log('--2-');
                    return vm.profileData;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                    return currentUserService.getMerchantAccount()
                        .then((merchantAccount)=>{
                            vm.profileData.paymentData = merchantAccount.userPayment;
                            return vm.profileData;
                        })
                        .then(function(){
                            return currentUserService.getMerchant()
                        })
                        .then(function(merchant){
                            vm.profileData.merchantData = merchant.merchantEntity[0];
                            console.log(vm.profileData.merchantData);
                            return vm.profileData;
                        });
                });
        }
        
        function activate() {
            getUser();
        }
    }
})();