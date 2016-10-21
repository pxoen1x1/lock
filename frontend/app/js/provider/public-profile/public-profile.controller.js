(function () {
    'use strict';

    angular
        .module('app.provider')
        .controller('ProviderPublicProfileController', ProviderPublicProfileController);

    ProviderPublicProfileController.$inject = ['$stateParams', 'coreDataservice', 'conf'];

    /* @ngInject */
    function ProviderPublicProfileController($stateParams, coreDataservice, conf) {
        var vm = this;

        vm.profileId = $stateParams.profileId;
        vm.baseUrl = conf.baseUrl;

        vm.profileData = {};
        vm.feedbackData = {};

        vm.getUser = getUser;

        activate();

        function getUser() {

            return coreDataservice.getUser(vm.profileId)
                .then(function (response) {
                    var user = response.data.user;

                    vm.profileData = user;
                    vm.profileData.portrait = user.portrait ? conf.BASE_URL + user.portrait : '';

                    return coreDataservice.getFeedbacks(vm.profileId);
                })
                .then(function (response) {

                    vm.feedbackData = response.data;

                    console.log(vm.feedbackData);

                    return vm.feedbackData;
                });
        }

        function activate() {
            getUser();
        }

    }
})();