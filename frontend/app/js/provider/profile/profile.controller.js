(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = [
        '$q',
        '$mdDialog',
        '$translate',
        'conf',
        'coreConstants',
        'coreDictionary',
        'coreDataservice',
        'currentUserService',
        'usingLanguageService',
        'citiesLoader',
        'mobileService'
    ];

    /* @ngInject */
    function ProviderProfileController($q, $mdDialog, $translate, conf, coreConstants, coreDictionary, coreDataservice,
                                       currentUserService, usingLanguageService, citiesLoader, mobileService) {
        var vm = this;

        vm.languages = [];
        vm.userProfile = {};
        vm.userProfile.merchantData = {};
        vm.userProfile.paymentData = {};
        vm.merchantFunds = 0;
        vm.nonChangedUserProfile = {};
        vm.enableWithdrawals = false;

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
        vm.licensesPresent = '';
        vm.servicesPresent = '';
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';
        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);

        vm.updateUser = updateUser;
        vm.setMerchantAccount = setMerchantAccount;
        vm.getUser = getUser;
        vm.addLicenseForm = addLicenseForm;
        vm.removeLicenseForm = removeLicenseForm;
        vm.cancelEditing = cancelEditing;
        vm.updateMerchant = updateMerchant;
        vm.withdrawal = withdrawal;

        vm.getCities = getCities;
        vm.searchText = null;
        vm.selectedCityItem = null;
        vm.selectedItemChange = selectedItemChange;
        vm.resetSelectedCity = resetSelectedCity;


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
                    coreDataservice.updateUser(user); //todo: ?? set and then update ??
                    $translate.use(user.usingLanguage.code);
                    usingLanguageService.setLanguage(user.usingLanguage);

                    return user;
                })
                .then(function (user) {

                    vm.userProfile = user;
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

                        return false;
                    }

                    vm.userProfile.merchantData = merchantEntity;
                    vm.userProfile.spMerchantId = vm.userProfile.merchantData.id;

                    return coreDataservice.getMerchantAccount();
                })
                .then(function (userPayment) {
                    vm.userProfile.paymentData = userPayment;

                    return currentUserService.setUserToLocalStorage(vm.userProfile);
                })
                .finally(function () {
                    vm.isEditingMerchant = false;
                });
        }

        function withdrawal() {
            coreDataservice.withdrawal(vm.userProfile.merchantData.id)
                .then(function (result) {
                    if (result === true) {
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Withdrawals request created')
                            .ok('Close');

                        vm.enableWithdrawals = false;
                    } else {
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Error during withdrawals')
                            .textContent('Please contact support')
                            .ok('Close');
                    }
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.userProfile = user;

                    return coreDataservice.getMerchantAccount()
                        .then(function (userPayment) {
                            vm.userProfile.paymentData = userPayment;

                            return vm.userProfile;
                        })
                        .then(function () {

                            return coreDataservice.getMerchant();
                        })
                        .then(function (merchantEntity) {
                            if (merchantEntity) {
                                vm.userProfile.merchantData = merchantEntity;
                                if (vm.userProfile.merchantData.city) {
                                    vm.selectedCityItem = vm.userProfile.merchantData.city;
                                }
                            }

                            return coreDataservice.getMerchantFunds();
                        })
                        .then(function (funds) {

                            if (funds && funds.available) {
                                vm.userProfile.merchantFunds = funds.available / 100; // in cents
                            }

                            return coreDataservice.isCreatedTodaysPayout();
                        })
                        .then(function (payoutCreated) {
                            if (!payoutCreated && vm.merchantFunds > 0) {
                                vm.enableWithdrawals = true;
                            }

                            return vm.userProfile;
                        });
                });
        }

        function addLicenseForm() {
            vm.userProfile.details.licenses.push({});
        }

        function removeLicenseForm(index) {
            vm.userProfile.details.licenses.splice(index, 1);
        }

        function cancelEditing() {
            vm.userProfile = angular.copy(vm.nonChangedUserProfile);
            vm.isEditing = false;
            vm.isEditingMerchant = false;
            vm.isEditingPayment = false;
        }

        function getStates() {
            return coreDictionary.getStates()
                .then(function (response) {
                    vm.states = getStatesList(response.states);

                    return vm.states;
                });
        }

        function getCities(query) {
            if (!vm.userProfile.merchantData.state) {

                return;
            }

            var selectedState = vm.states[vm.userProfile.merchantData.state];

            return citiesLoader.getCities(selectedState.id, query)
                .then(function (cities) {

                    return cities;
                });
        }

        function selectedItemChange(city) {
            if (!city) {
                return;
            }

            vm.userProfile.merchantData.city = city.city;
        }

        function resetSelectedCity() {
            vm.userProfile.merchantData.city = null;
            vm.selectedCityItem = null;
        }

        function getServiceTypes() {

            return coreDictionary.getServiceTypes()
                .then(function (serviceTypes) {
                    vm.serviceTypes = serviceTypes;

                    return vm.serviceTypes;
                });
        }

        function getStatesList(states) {
            var statesList = {};

            states.forEach(function (state) {
                statesList[state.code] = state;
            });

            return statesList;
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
                        vm.licensesPresent = vm.userProfile.details.licenses.length !== 0;
                        vm.servicesPresent = vm.userProfile.details.serviceTypes.length !== 0;
                        vm.nonChangedUserProfile = angular.copy(vm.userProfile);
                    }
                );
        }
    }
})();