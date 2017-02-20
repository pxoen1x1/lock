(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = [
        '$q',
        '$translate',
        'conf',
        'coreConstants',
        'coreDictionary',
        'currentUserService',
        'coreDataservice',
        'usingLanguageService',
        'citiesLoader',
        'mobileService',
    ];

    /* @ngInject */
    function CustomerProfileController($q, $translate, conf, coreConstants, coreDictionary, currentUserService,
                                       coreDataservice, usingLanguageService, citiesLoader, mobileService) {
        var vm = this;

        vm.userProfile = {};
        vm.customerData = {};
        vm.nonChangedUserProfile = {};
        vm.newPortrait = '';
        vm.languages = [];
        vm.states = [];
        vm.searchText = null;
        vm.selectedCityItem = null;
        vm.isEditing = false;

        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;

        vm.updateUser = updateUser;
        vm.updateCustomer = updateCustomer;
        vm.updateCustomerCard = updateCustomerCard;
        vm.getUser = getUser;
        vm.getCities = getCities;
        vm.cancelEditing = cancelEditing;
        vm.resetSelectedCity = resetSelectedCity;
        vm.getCities = getCities;
        vm.selectedItemChange = selectedItemChange;
        vm.viewUserPhoto = viewUserPhoto;
        vm.removePhoto = removePhoto;

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

            var params = {
                customerData: customerData
            };

            return coreDataservice.updateCustomer(params)
                .then(function (customer) {
                    vm.customerData = customer.customer[0];
                    return vm.customerData;
                }).then(function () {
                    vm.isEditingCustomer = false;
                });
        }

        function updateCustomerCard(cardData, isFormValid) {
            if (!isFormValid) {
                return;
            }

            return coreDataservice.updateCustomerCard(cardData)
                .then(function (spCardNumber) {
                    if (!spCardNumber) {
                        return;
                    }

                    vm.userProfile.spCardNumber = spCardNumber.payment.number;

                    return currentUserService.setUserToLocalStorage(vm.userProfile);
                }).finally(function () {
                    vm.isEditingCard = false;
                });
        }

        function viewUserPhoto() {
            if (vm.newPortrait) {

                return vm.newPortrait;
            } else {

                return vm.userProfile.portrait ? conf.BASE_URL + vm.userProfile.portrait : vm.defaultPortrait;
            }
        }

        function removePhoto() {
            vm.userProfile.portrait = '';
            vm.newPortrait = '';
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
                    vm.userProfile.portrait = user.portrait ? user.portrait : '';
                    vm.newPortrait = '';
                    vm.isEditing = false;

                    $translate.use(user.usingLanguage.code);
                    usingLanguageService.setLanguage(vm.userProfile.usingLanguage);

                    return vm.userProfile;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {
                    vm.userProfile = user;
                    vm.nonChangedUserProfile = angular.copy(vm.userProfile);

                    return coreDataservice.getCustomer()
                        .then(function (customer) {

                            if (customer && customer.customer[0]) {
                                vm.customerData = customer.customer[0];
                                if (vm.customerData.city) {
                                    vm.selectedCityItem = vm.customerData.city;
                                }
                            }
                            return vm.userProfile;
                        });
                });
        }


        function getStates() {
            return coreDictionary.getStates()
                .then(function (response) {
                    vm.states = getStatesList(response.states);

                    return vm.states;
                });
        }

        function getStatesList(states) {
            var statesList = {};
            states.forEach(function (state) {
                statesList[state.state] = state;
            });

            return statesList;
        }

        function getCities(query) {
            if (!vm.customerData.state) {

                return;
            }

            var selectedState = vm.states[vm.customerData.state];

            return citiesLoader.getCities(selectedState.id, query)
                .then(function (cities) {

                    return cities;
                });
        }

        function selectedItemChange(city) {
            if (!city) {
                return;
            }

            vm.customerData.city = city.city;
        }

        function resetSelectedCity() {
            vm.customerData.city = null;
            vm.selectedCityItem = null;
        }

        function cancelEditing() {
            vm.userProfile = angular.copy(vm.nonChangedUserProfile);
            vm.isEditing = false;
            vm.isEditingCustomer = false;
            vm.isEditingCard = false;
            if (vm.customerData && vm.customerData.city) {
                vm.selectedCityItem = vm.customerData.city || null;
            }
        }

        function activate() {
            $q.all([
                    getUser(),
                    getLanguages(),
                    getStates()
                ])
                .then(function () {
                    vm.userProfile.usingLanguage = vm.userProfile.usingLanguage || usingLanguageService.getLanguage();

                    if (vm.customerData && vm.customerData.state) {
                        vm.getCities(vm.customerData.state);
                    }
                });
        }
    }
})();