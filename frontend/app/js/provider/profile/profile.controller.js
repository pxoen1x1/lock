(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = [
        '$q',
        'conf',
        'coreConstants',
        'coreDataservice',
        'coreDictionary',
        'currentUserService',
        'usingLanguageService',
    ];

    /* @ngInject */
    function ProviderProfileController($q, conf, coreConstants, coreDataservice, coreDictionary, currentUserService,
                                       usingLanguageService) {
        var vm = this;

        vm.languages = [];
        vm.userProfile = {};
        vm.userProfile.merchantData = {};
        vm.userProfile.paymentData = {};

        var promises = {
            getBankAccountTypes: null,
            getStates: null
        };


        vm.bankAccountTypes = [];
        vm.states = [];
        vm.serviceTypes = [];

        vm.datePickerOptions = {
            minDate: new Date()
        };

        vm.isEditing = false;
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';

        vm.updateUser = updateUser;
        vm.setMerchantAccount = setMerchantAccount;
        vm.getUser = getUser;
        vm.updateMerchant = updateMerchant;

        activate();

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages;

                    return vm.languages;
                });
        }

        function getBankAccountTypes() {

            if (promises.getBankAccountTypes) {
                promises.getBankAccountTypes.cancel();
            }

            promises.getBankAccountTypes = coreDataservice.getBankAccountTypes();

            return promises.getBankAccountTypes
                .then(function (bankAccountTypes) {
                    vm.bankAccountTypes = bankAccountTypes;

                    return vm.bankAccountTypes;
                });
        }
        
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

                    vm.userProfile = user;
                    vm.userProfile.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';
                    vm.newPortrait = '';
                    vm.isEditing = false;

                    return vm.userProfile;
                });
        }

        function setMerchantAccount(userPayment, isFormValid) {
            if (!isFormValid) {

                return;
            }

            return coreDataservice.setMerchantAccount(userPayment)
                .then(function (userPayment) {
                    vm.userProfile.paymentData = userPayment;
                    vm.isEditingPayment = false;
                    return vm.userProfile;
                });
        }

        function updateMerchant(userProfile, isFormValid) {
            if (!isFormValid) {
                return;
            }

            return coreDataservice.updateMerchant(userProfile)
                .then(function (merchantEntity) {
                    if (!merchantEntity) {
                        console.log('error during saving merchant data');
                        return false;
                    }
                    vm.userProfile.merchantData = merchantEntity;
                    vm.userProfile.spMerchantId = vm.userProfile.merchantData.id;
                    return currentUserService.setUserToLocalStorage(vm.userProfile);

                }).finally(function (user) {
                    vm.isEditingMerchant = false;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.userProfile = user;
                    vm.userProfile.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';
                                        
                    return coreDataservice.getMerchantAccount()
                        .then((userPayment)=> {
                            vm.userProfile.paymentData = userPayment;
                            return vm.userProfile;
                        })
                        .then(function () {
                            return coreDataservice.getMerchant()
                        })
                        .then(function (merchantEntity) {
                            if (merchantEntity) {
                                vm.userProfile.merchantData = merchantEntity;
                                return vm.userProfile;
                            }
                        });
                });
        }

        function activate() {
            $q.all([
                getUser(),
                getLanguages(),
                getStates(),
                getBankAccountTypes(),
                getServiceTypes()
            ])
                .then(function () {
                    vm.userProfile.usingLanguage = vm.userProfile.usingLanguage || usingLanguageService.getLanguage();
                });
        }

        function getStates() {
            return coreDictionary.getStates()
                .then(function (response) {
                    vm.states = response.states;

                    return vm.states;
                });
        }

        function getServiceTypes() {

            return coreDictionary.getServiceTypes()
                .then(function (serviceTypes) {
                    vm.serviceTypes = serviceTypes.serviceTypes;

                    return vm.serviceTypes;
                });
        }
        
    }
})();