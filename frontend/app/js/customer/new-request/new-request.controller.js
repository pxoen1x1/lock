(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('NewRequestController', NewRequestController);

    NewRequestController.$inject = ['$q', 'coreDictionary'];

    /* @ngInject */
    function NewRequestController($q, coreDictionary) {
        var vm = this;

        vm.request = {};

        vm.services = [];
        vm.languages = [];

        vm.isEmergency = null;
        vm.isLocationSetManually = null;
        vm.searchCity = '';

        vm.createRequest = createRequest;

        activate();

        function getServices() {

            return coreDictionary.getServices()
                .then(function (services) {
                    vm.services = services.services;

                    return vm.services;
                });
        }

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages.languages;

                    return vm.languages;
                });
        }

        function createRequest(request, isFormValid) {
            if (!isFormValid) {

                return;
            }
        }

        function activate() {
            $q.all(
                getServices(),
                getLanguages()
            );
        }
    }
})();