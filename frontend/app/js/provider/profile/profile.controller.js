(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderProfileController', ProviderProfileController);

    ProviderProfileController.$inject = [
        '$q',
        'coreConstants',
        'conf',
        'coreDictionary',
        'currentUserService',
        'usingLanguageService',
        'coreDataservice'
    ];

    /* @ngInject */
    function ProviderProfileController($q, coreConstants, coreDataservice, conf, coreDictionary, currentUserService,
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
        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;
        vm.newPortrait = '';

        vm.updateUser = updateUser;
        vm.getUser = getUser;

        activate();

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

                    vm.userProfile = user;
                    vm.userProfile.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';
                    vm.newPortrait = '';
                    vm.isEditing = false;

                    return vm.userProfile;
                });
        }

        function getUser() {

            return currentUserService.getUser()
                .then(function (user) {

                    vm.userProfile = user;
                    vm.userProfile.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                    return vm.userProfile;
                });
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
                    vm.serviceTypes = serviceTypes.serviceTypes;

                    return vm.serviceTypes;
                });
        }
        
    }
})();