(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = ['currentUserService', 'coreDataservice', 'coreConstants', 'conf', 'bankAccountTypes', 'geo'];

    /* @ngInject */
    function ProviderProfileController(currentUserService, coreDataservice, coreConstants, conf, bankAccountTypes, geo) {
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
        vm.setMerchantAccount = setMerchantAccount;
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

        function setMerchantAccount(userPayment, isFormValid) {
            if (!isFormValid) {

                return;
            }

            return coreDataservice.setMerchantAccount(userPayment)
                .then(function (userPayment) {
                    vm.profileData.paymentData = userPayment;
                    vm.isEditingPayment = false;
                    return vm.profileData;
                });
        }

        function updateMerchant(profileData, isFormValid) {
            if (!isFormValid) {
                return;
            }

            return coreDataservice.updateMerchant(profileData)
                .then(function (merchantEntity) {
                    if(!merchantEntity){
                        console.log('error during saving merchant data');
                        return false;
                    }
                    vm.profileData.merchantData = merchantEntity;
                    vm.profileData.spMerchantId = vm.profileData.merchantData.id;
                    return currentUserService.setUserToLocalStorage(vm.profileData);

                }).then(function(user){
                    vm.isEditingMerchant = false;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                    return coreDataservice.getMerchantAccount()
                        .then((userPayment)=>{
                            vm.profileData.paymentData = userPayment;
                            return vm.profileData;
                        })
                        .then(function(){
                            return coreDataservice.getMerchant()
                        })
                        .then(function(merchantEntity){
                            if(merchantEntity){
                                vm.profileData.merchantData = merchantEntity;
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