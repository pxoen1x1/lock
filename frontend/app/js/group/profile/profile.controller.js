(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupProfileController', GroupProfileController);

    GroupProfileController.$inject = [
        '$q',
        '$mdDialog',
        '$translate',
        '$filter',
        'conf',
        'coreConstants',
        'coreDataservice',
        'coreDictionary',
        'currentUserService',
        'localService',
        'usingLanguageService',
        'citiesLoader',
        'mobileService',
        'serviceProviderConstants'
    ];

    /* @ngInject */
    function GroupProfileController($q, $mdDialog, $translate, $filter, conf, coreConstants, coreDataservice, coreDictionary,
                                    currentUserService, localService, usingLanguageService, citiesLoader, mobileService, serviceProviderConstants) {
        var vm = this;

        vm.languages = [];
        vm.userProfile = {};
        vm.merchantData = null;
        vm.payment = null;
        vm.paymentData = null;
        vm.merchantFunds = 0;
        vm.userProfile.licenses = {};
        vm.enableWithdrawals = false;
        vm.nonChangedUserProfile = {};

        var promises = {
            getBankAccountTypes: null,
            getStates: null
        };


        vm.bankAccountTypes = [];
        vm.states = [];
        vm.bankAccountStatuses = serviceProviderConstants.ACCOUNT_STATUSES;

        vm.datePickerOptions = {
            minDate: moment(),
            maxDate: moment().add(10, 'years')
        };
        vm.dateFormat = coreConstants.DATE_FORMAT;

        vm.isEditing = false;
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';
        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = mobileService.getImagePath(coreConstants.IMAGES.defaultPortrait);
        vm.searchText = null;
        vm.selectedCityItem = null;

        vm.updateUser = updateUser;
        vm.setMerchantAccount = setMerchantAccount;
        vm.getUser = getUser;
        vm.addLicenseForm = addLicenseForm;
        vm.removeLicenseForm = removeLicenseForm;
        vm.updateMerchant = updateMerchant;
        vm.withdrawal = withdrawal;
        vm.viewUserPhoto = viewUserPhoto;
        vm.removePhoto = removePhoto;
        vm.cancelEditing = cancelEditing;

        vm.getCities = getCities;
        vm.selectedItemChange = selectedItemChange;
        vm.resetSelectedCity = resetSelectedCity;
        vm.resetSelectedCity = resetSelectedCity;
        vm.spAgreementModal = spAgreementModal;

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

        function viewUserPhoto() {
            if (vm.newPortrait !== '') {

                return vm.newPortrait;
            } else {

                return vm.userProfile.portrait ? vm.baseUrl + vm.userProfile.portrait : vm.defaultPortrait;
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
                    coreDataservice.updateUser(user); //todo: ?? set and then update ??
                    $translate.use(user.usingLanguage.code);
                    usingLanguageService.setLanguage(user.usingLanguage);

                    return user;
                })
                .then(function (user) {

                    vm.userProfile = user;
                    vm.nonChangedUserProfile = user;
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
                    vm.paymentData = userPayment;
                    vm.paymentData[0].modified = new Date(vm.paymentData[0].modified.replace(' ','T'));

                    vm.isEditingPayment = false;
                    return vm.userProfile;
                });
        }

        function updateMerchant(merchantData, isFormValid) {
            if (!isFormValid) {

                return;
            }

            var params = {
                merchantData: merchantData
            };

            return coreDataservice.updateMerchant(params)
                .then(function (merchantEntity) {
                    if (!merchantEntity) {
                        return false;
                    }
                    vm.merchantData = merchantEntity;
                    vm.userProfile.spMerchantId = vm.merchantData.id;

                    if (vm.merchantData.city) {
                        vm.selectedCityItem = vm.merchantData.city;
                    }
                    return currentUserService.setUserToLocalStorage(vm.userProfile);

                }).finally(function () {
                    vm.isEditingMerchant = false;
                });
        }

        function withdrawal() {
            coreDataservice.withdrawal(vm.merchantData.id)
                .then(function (result) {
                    if (result === true) {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title($filter('translate')('WITHDRAWALS_REQUEST_CREATED'))
                            .ok($filter('translate')('CLOSE'))
                        );
                        vm.enableWithdrawals = false;
                    } else {
                        $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title($filter('translate')('ERROR_DURING_WITHDRAWALS'))
                            .textContent($filter('translate')('PLEASE_CONTACT_SUPPORT'))
                            .ok($filter('translate')('CLOSE'))
                        );
                    }
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {
                    vm.userProfile = user;
                    vm.nonChangedUserProfile = angular.copy(vm.userProfile);

                    return coreDataservice.getAdminsGroup();
                })
                .then(function (group) {
                    vm.userProfile.licenses = group.licenses;

                    return coreDataservice.getMerchantAccount();
                })
                .then(function (userPayment) {
                    vm.paymentData = userPayment;
                    if(vm.paymentData && vm.paymentData[0] && vm.paymentData[0].modified) {
                        vm.paymentData[0].modified = new Date(vm.paymentData[0].modified.replace(' ', 'T'));
                    }

                    return vm.userProfile;
                })
                .then(function () {

                    return coreDataservice.getMerchant();
                })
                .then(function (merchantEntity) {
                    if (merchantEntity) {
                        vm.merchantData = merchantEntity;
                        if (vm.merchantData.city) {
                            vm.selectedCityItem = vm.merchantData.city;
                        }
                    }

                    return coreDataservice.getMerchantFunds();
                })
                .then(function (funds) {
                    if (funds && funds.available) {
                        vm.merchantFunds = funds.available / 100; // in cents
                    }

                    return coreDataservice.isCreatedTodaysPayout();
                })
                .then(function (payoutCreated) {
                    if (!payoutCreated && vm.merchantFunds > 0) {
                        vm.enableWithdrawals = true;
                    }

                    return vm.userProfile;
                });
        }

        function addLicenseForm() {
            vm.userProfile.licenses.push({});
        }

        function removeLicenseForm(index) {
            vm.userProfile.licenses.splice(index, 1);
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
                statesList[state.code] = state;
            });

            return statesList;
        }

        function getCities(query) {
            if (!vm.merchantData.state) {

                return;
            }

            var selectedState = vm.states[vm.merchantData.state];

            return citiesLoader.getCities(selectedState.id, query)
                .then(function (cities) {

                    return cities;
                });
        }

        function selectedItemChange(city) {
            if (!city) {
                return;
            }

            vm.merchantData.city = city.city;
        }

        function resetSelectedCity() {
            vm.merchantData.city = null;
            vm.selectedCityItem = null;
        }


        function cancelEditing() {
            vm.userProfile = angular.copy(vm.nonChangedUserProfile);
            vm.isEditing = false;
            vm.isEditingMerchant = false;
            vm.isEditingPayment = false;
        }

        function spAgreementModal(ev) {

            $mdDialog.show({
                    controller: 'SpAgreementDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'provider/sp-agreement-dialog/sp-agreement-dialog.html',
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true
                })
                .then(function (result) {
                    if (result) {

                        return coreDataservice.setGroupSpAgreed(vm.userProfile.groups[0].id)
                            .then(function(group) {

                                vm.userProfile.groups[0] = group;

                                return localService.setUser(vm.userProfile);
                            });
                    }
                });
        }

        function activate() {
            $q.all([
                getUser(),
                getLanguages(),
                getBankAccountTypes(),
                getStates()
            ]);
        }

    }
})();