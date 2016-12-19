(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = ['currentUserService', 'coreConstants', 'conf', 'bankAccountTypes', 'geo'];

    /* @ngInject */
    function ProviderProfileController(currentUserService, coreConstants, conf, bankAccountTypes, geo) {
        var vm = this;

        vm.profileData = {};
        vm.profileData.merchantData = {};
        vm.profileData.paymentData = {};
        vm.bankAccountTypes = bankAccountTypes;
        vm.states = geo.states;

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
                    vm.profileData.paymentData = userPayment.userPayment;
                    vm.isEditingPayment = false;
                    return vm.profileData;
                });
        }

        function updateMerchant(profileData, isFormValid) {
            if (!isFormValid) {
                return;
            }

            return currentUserService.updateMerchant(profileData)
                .then(function (merchant) {
                    if(merchant.merchantEntity.length == 0){
                        console.log('error during saving merchant data');
                        return false;
                    }
                    vm.profileData.merchantData = merchant.merchantEntity[0];
                    vm.profileData.spMerchantId = vm.profileData.merchantData.id;
                    return currentUserService.setUserToLocalStorage(vm.profileData);

                }).then(function(user){
                    vm.isEditingCard = false;
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
                            if(merchant.merchantEntity.length > 0){
                                vm.profileData.merchantData = merchant.merchantEntity[0];
                                return vm.profileData;
                            }
                        });
                });
        }
        
        function activate() {
            getUser();
        }
    }
})();