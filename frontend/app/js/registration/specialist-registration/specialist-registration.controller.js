(function () {
    'use strict';

    angular
        .module('app.registration')
        .controller('SpecialistRegistrationController', SpecialistRegistrationController);

    SpecialistRegistrationController.$inject = [
        '$q',
        '$state',
        'coreDataservice',
        'coreConstants',
        'coreDictionary',
        'authService',
        'registrationConstants'
    ];

    /* @ngInject */
    function SpecialistRegistrationController($q, $state, coreDataservice, coreConstants, coreDictionary, authService,
                                              registrationConstants) {
        var promises = {
            getState: null
        };

        var vm = this;

        vm.user = {
            details: {},
            groups: {}
        };
        vm.auth = {};
        vm.states = [];
        vm.languages = [];
        vm.serviceTypes = [];
        vm.licenses = [{}];
        vm.validSteps = {};
        vm.currentStep = 0;

        vm.isAgreeWithAgreement = false;
        vm.isCompanyRegistrationSelected = false;

        vm.datePickerOptions = {
            minDate: new Date()
        };

        vm.timePickerOptions = coreConstants.MD_PICKERS_OPTIONS.timePicker;
        vm.registrationSteps = registrationConstants.SPECIALIST_REGISTRATION_STEPS;

        vm.goToNextStep = goToNextStep;
        vm.goToPrevStep = goToPrevStep;
        vm.goToStep = goToStep;
        vm.createNewUser = createNewUser;
        vm.addLicenseForm = addLicenseForm;
        vm.removeLicenseForm = removeLicenseForm;

        activate();

        function getLanguages() {

            return coreDictionary.getLanguages()
                .then(function (languages) {
                    vm.languages = languages;

                    return vm.languages;
                });
        }

        function getServiceTypes() {

            return coreDictionary.getServiceTypes()
                .then(function (serviceTypes) {
                    vm.serviceTypes = serviceTypes;

                    return vm.serviceTypes;
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

        function createUser(user) {

            return authService.register(user)
                .then(function () {

                    $state.go('home');
                });
        }

        function goToNextStep(isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep++;
        }

        function goToPrevStep(isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep--;
        }

        function goToStep(indexStep, isStepValid) {
            vm.validSteps[vm.currentStep] = isStepValid;

            vm.currentStep = indexStep;
        }

        function createNewUser(auth, user, isFormValid) {
            if (!isFormValid) {

                return;
            }

            if (vm.isCompanyRegistrationSelected) {
                user.groups.licenses = remoleInvalidLicenses(vm.licenses);

                delete user.details;
            } else {
                user.details.licenses = remoleInvalidLicenses(vm.licenses);

                delete user.groups;
            }

            auth.user = user;

            var params = {
                auth: auth
            };

            createUser(params);
        }

        function addLicenseForm() {

            vm.licenses.push({});
        }

        function removeLicenseForm(index) {
            vm.licenses.splice(index, 1);
        }

        function remoleInvalidLicenses(licenses) {
            licenses = licenses.filter(function (license) {

                return license.number && (license.state && license.state.id) && license.date;
            });

            return licenses;
        }

        function activate() {
            $q.all([
                getLanguages(),
                getServiceTypes(),
                getStates()
            ]);
        }
    }
})();