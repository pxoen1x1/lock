(function () {
    'use strict';

    angular
        .module('app.group')
        .controller('GroupProfileController', GroupProfileController);

    GroupProfileController.$inject = [
        '$q',
        'conf',
        'coreConstants',
        'coreDataservice',
        'coreDictionary',
        'currentUserService',
        '$mdDialog',
        '$translate'
    ];

    /* @ngInject */
    function GroupProfileController($q, conf, coreConstants, coreDataservice, coreDictionary, currentUserService,
                                    $mdDialog, $translate) {
        var vm = this;
        var dialog = {
            title: 'WITHDRAWALS_REQUEST_CREATED',
            ok: 'CLOSE',
            error: {
                title: 'ERROR_DURING_WITHDRAWALS',
                textContent: 'PLEASE_CONTACT_SUPPORT'
            }
        };

        vm.languages = [];
        vm.userProfile = {};
        vm.userProfile.merchantData = {};
        vm.userProfile.paymentData = {};
        vm.userProfile.merchantFunds = 0;
        vm.userProfile.licenses = {};
        vm.enableWithdrawals = false;

        var promises = {
            getBankAccountTypes: null,
            getStates: null
        };


        vm.bankAccountTypes = [];
        vm.states = [];

        vm.datePickerOptions = {
            minDate: new Date()
        };

        vm.isEditing = false;
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';
        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

        vm.updateUser = updateUser;
        vm.setMerchantAccount = setMerchantAccount;
        vm.getUser = getUser;
        vm.addLicenseForm = addLicenseForm;
        vm.removeLicenseForm = removeLicenseForm;
        vm.updateMerchant = updateMerchant;
        vm.withdrawal = withdrawal;

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
                    return currentUserService.setUserToLocalStorage(vm.userProfile);

                }).finally(function () {
                    vm.isEditingMerchant = false;
                });
        }

        function withdrawal() {
            coreDataservice.withdrawal(vm.userProfile.merchantData.id)
                .then(function (result) {
                    if (result === true) {
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(dialog.title)
                            .ok(dialog.ok);

                        vm.enableWithdrawals = false;
                    } else {
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title(dialog.error.title)
                            .textContent(dialog.error.textContent)
                            .ok(dialog.ok);
                    }
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {
                    vm.userProfile = user;

                    return coreDataservice.getAdminsGroup();
                })
                .then(function (group) {
                    vm.userProfile.licenses = group.licenses;

                    return coreDataservice.getMerchantAccount();
                })
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
                    }

                    return coreDataservice.getMerchantFunds();
                })
                .then(function (funds) {
                    if(funds && funds.available){
                        vm.userProfile.merchantFunds = funds.available / 100; // in cents
                    }

                    return coreDataservice.isCreatedTodaysPayout();
                })
                .then(function (payoutCreated) {
                    if (!payoutCreated && vm.userProfile.merchantFunds > 0) {
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
                    vm.states = response.states;

                    return vm.states;
                });
        }

        function getDialogTranslation() {
            $translate('WITHDRAWALS_REQUEST_CREATED')
                .then(function(translation) {
                    dialog.title = translation;
                });
            $translate('ERROR_DURING_WITHDRAWALS')
                .then(function(translation) {
                    dialog.error.title = translation;
                });
            $translate('CLOSE')
                .then(function(translation) {
                    dialog.ok = translation;
                });
            $translate('PLEASE_CONTACT_SUPPORT')
                .then(function(translation) {
                    dialog.error.textContent = translation;
                });
        }

        function activate() {
            $q.all([
                getUser(),
                getLanguages(),
                getBankAccountTypes(),
                getStates(),
                getDialogTranslation()
            ]);
        }

    }
})();