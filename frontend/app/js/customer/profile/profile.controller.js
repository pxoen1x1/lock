(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerProfileController', CustomerProfileController);

    CustomerProfileController.$inject = [
        '$q',
        'coreConstants',
        'conf',
        'coreDictionary',
        'currentUserService',
        'usingLanguageService'];

    /* @ngInject */
    function CustomerProfileController($q, coreConstants, conf, coreDictionary, currentUserService,
                                       usingLanguageService) {
        var vm = this;

        vm.userProfile = {};
        vm.newPortrait = '';
        vm.languages = [];

        vm.isEditing = false;

        vm.fileUploaderOptions = coreConstants.FILE_UPLOADER_OPTIONS;

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

                    usingLanguageService.setLanguage(vm.userProfile.usingLanguage);

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
                getLanguages()
            ])
                .then(function () {
                    vm.userProfile.usingLanguage = vm.userProfile.usingLanguage || usingLanguageService.getLanguage();
                });
        }
    }
})();