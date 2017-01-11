(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = [
        '$q',
        'coreDictionary',
        'currentUserService',
        'coreConstants',
        'coreDataservice',
        'conf',
        'usingLanguageService',
        'citiesLoader'
    ];

    /* @ngInject */
    function CustomerProfileController($q, coreDictionary, currentUserService, coreConstants, coreDataservice, conf,
    usingLanguageService, citiesLoader) {
        var vm = this;

        vm.userProfile = {};
        vm.userProfile.customerData = {};
        vm.userProfile.paymentData = {};
        vm.nonChangedUserProfile = {};
        vm.newPortrait = '';
        vm.languages = [];
        vm.states = [];
        vm.cities = [];
        vm.searchCity = '';
        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

        vm.isEditing = false;

        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;

        vm.updateUser = updateUser;
        vm.updateCustomer = updateCustomer;
        vm.updateCustomerCard = updateCustomerCard;
        vm.getUser = getUser;
        vm.getCities = getCities;
        vm.cancelEditing = cancelEditing;

        vm.getStateByName = getStateByName;

        activate();

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages;

                    return vm.languages;
                });
        }

        function updateCustomer(customerData, isFormValid) {
            if (!isFormValid) {

                return;
            }


            return coreDataservice.updateCustomer(customerData)
                .then(function (customer) {
                    vm.userProfile.customerData = customer.customer[0];
                    return vm.userProfile;
                }).then(function(){
                    vm.isEditingCustomer = false;
                });
        }

        function updateCustomerCard(cardData, isFormValid) {
            if (!isFormValid) {
                return;
            }

            return coreDataservice.updateCustomerCard(cardData)
                .then(function (spCardNumber) {
                    if(!spCardNumber){
                        return;
                    }

                    vm.userProfile.spCardNumber = '****' + spCardNumber;

                    return currentUserService.setUserToLocalStorage(vm.userProfile);
                }).finally(function(){
                    vm.isEditingCard = false;
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

                    usingLanguageService.setLanguage(vm.userProfile.usingLanguage);

                    return vm.userProfile;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.userProfile = user;
                    vm.userProfile.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                    return coreDataservice.getCustomer()
                        .then(function(customer){

                            if(customer){
                                vm.userProfile.customerData = customer.customer[0];
                            }

                            return vm.userProfile;
                        });
                });
        }


        function getStates() {
            return coreDictionary.getStates()
                .then(function (response) {
                    vm.states = response.states;

                    return vm.states;
                });
        }

        function getStateByName(state) {

            for (var i=0; i < vm.states.length; i++) {
                if (vm.states[i].state === state) {
                    return vm.states[i];
                }
            }

        }

        function getCities(state, query) {
            let cityId = vm.getStateByName(state).id;
            return citiesLoader.getCities(cityId, query)
                .then(function (cities) {
                    vm.cities = cities;

                    return vm.cities;
                });
        }

        function cancelEditing() {
            vm.userProfile = angular.copy(vm.nonChangedUserProfile);
            vm.isEditing = false;
            vm.isEditingCustomer = false;
            vm.isEditingCard = false;
        }

        function activate() {
            $q.all([
                getUser(),
                getLanguages(),
                getStates()
            ])
                .then(function () {
                    vm.userProfile.usingLanguage = vm.userProfile.usingLanguage || usingLanguageService.getLanguage();

                    vm.nonChangedUserProfile = angular.copy(vm.userProfile);
                    vm.getCities(vm.userProfile.customerData.state);
                });
        }
    }
})();