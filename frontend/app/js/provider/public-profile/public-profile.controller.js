(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderPublicProfileController', ProviderPublicProfileController);

    ProviderPublicProfileController.$inject = [
        '$stateParams',
        'coreDataservice',
        'conf',
        'coreConstants'
    ];

    /* @ngInject */
    function ProviderPublicProfileController($stateParams, coreDataservice, conf, coreConstants) {
        var vm = this;

        vm.profileId = $stateParams.profileId;
        vm.defaultPortrait = coreConstants.IMAGES.defaultPortrait;
        vm.baseUrl = conf.BASE_URL;

        // vm.profileData = {};
        vm.userProfile = {};
        vm.feedbackData = {};

        vm.getUser = getUser;

        activate();

        function getUser() {

            return coreDataservice.getUser(vm.profileId)
                .then(function (response) {
                    var user = response.data.user;

                    // vm.profileData = user;
                    vm.userProfile = user;
                    vm.userProfile.portrait = user.portrait ? user.portrait : '';

                    return coreDataservice.getFeedbacks(vm.profileId);
                })
                .then(function (response) {

                    vm.feedbackData = response.data;

                    return vm.feedbackData;
                });
        }

        function activate() {
            getUser();
        }

    }
})();