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

        var promises = {
            getState: null
        };

        vm.profileData = {};
        vm.datePickerOptions = {
            minDate: new Date()
        };
        vm.states = [];
        vm.serviceTypes = [];

        vm.isEditing = false;
        vm.licensesPresent = '';
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';
        vm.baseUrl = conf.BASE_URL;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;

        vm.updateUser = updateUser;
        vm.getUser = getUser;
        vm.addLicenseForm = addLicenseForm;
        vm.removeLicenseForm = removeLicenseForm;

        activate();

        function licensesPresent() {
            if (vm.userProfile.details.licenses.length === 0) {

                return vm.licensesPresent = false;
            } else {

                return vm.licensesPresent = true;
            }
        }

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages;

                    return vm.languages;
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
                    coreDataservice.updateUser(user);

                    return user;
                })
                .then(function (user) {

                    vm.userProfile = user;
                    vm.newPortrait = '';
                    vm.isEditing = false;

                    return vm.userProfile;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.userProfile = user;

                    return vm.userProfile;
                });
        }

        function addLicenseForm() {
            vm.userProfile.details.licenses.push({});
        }

        function removeLicenseForm(index) {
            vm.userProfile.details.licenses.splice(index, 1);
        }

        function activate() {
            $q.all([
                getUser(),
                getLanguages(),
                getStates(),
                getServiceTypes()
            ])
                .then(function () {
                    vm.userProfile.usingLanguage = vm.userProfile.usingLanguage || usingLanguageService.getLanguage();
                    licensesPresent();
                });
        }

        function getStates() {
            if (promises.getStates) {
                promises.getStates.cancel();
            }

            promises.getStates = coreDataservice.getStates();

            return promises.getStates
                .then(function (response) {
                    vm.states = response.data.states;

                    return vm.states;
                });
        }

        function getServiceTypes() {

            return coreDictionary.getServiceTypes()
                .then(function (serviceTypes) {
                    vm.serviceTypes = serviceTypes;

                    return vm.serviceTypes;
                });
        }

    }
})();